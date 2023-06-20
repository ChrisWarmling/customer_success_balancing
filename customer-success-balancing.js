/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {

  //filtrar os que estão de folga
  const activeCustomerSuccess = filterAwayCustomerSuccess(customerSuccess, customerSuccessAway)

  //ordenar no menor para o maior
  const sortedCustomerSuccess = sortCustomerSuccessByScore(activeCustomerSuccess)

  //separa e soma os clientes pelos respectivos gerentes
  const customersBySuccess = groupCustomersBySuccess(customers, sortedCustomerSuccess)

  //retorna os gerentes com mais clientes
  const successWithMostCustomers = findSuccessWithMostCustomers(customersBySuccess)

  return successWithMostCustomers.length === 1 ? Number(successWithMostCustomers[0][0]) : 0
}

/**
 * Function to filter the time off customer success
 * @param {{id: number, score: number}[]} customerSuccess 
 * @param {{id: number, score: number}[]} customerSuccessAway 
 * @returns {{id: number, score: number}[]}
 */
function filterAwayCustomerSuccess(customerSuccess, customerSuccessAway){
  return customerSuccess.filter(({ id }) => !customerSuccessAway.includes(id))
}

/**
 * Function to sort the customer success
 * @param {{id: number, score: number}[]} customerSuccess 
 * @returns {{id: number, score: number}[]}
 */
function sortCustomerSuccessByScore(customerSuccess) {
  return customerSuccess.sort((a, b) => a.score - b.score)
}

/**
 * Function to separate and add customers by customer success
 * @param {{id: number, score: number}[]} customers
 * @param {{id: number, score: number}[]} customerSuccess
 * @returns {{[key: string]: number}} Key corresponds to the customer success id and the value number corresponds to the total customer
 */
function groupCustomersBySuccess(customers, customerSuccess) {
  return customers.reduce((accumulator, currentValue) => {

    const selectedCss = customerSuccess.find(({ score }) => currentValue.score <= score)

    if (!selectedCss) return accumulator;

    accumulator[String(selectedCss.id)] = (accumulator[selectedCss.id] || 0) + 1

    return accumulator

  }, {})
}

/**
 * Function that returns the customer success with the most customers
 * @param {{[key: string]: number}} customerBySuccess 
 * @returns {[string, number][]}
 */
function findSuccessWithMostCustomers(customerBySuccess) {
  const successEntries = Object.entries(customerBySuccess)

  const maxCustomers = Math.max(...successEntries.map(([_, count]) => count))

  return successEntries.filter(([_, count]) => count === maxCustomers)
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});
