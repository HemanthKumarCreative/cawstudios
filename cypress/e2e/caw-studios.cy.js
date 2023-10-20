let tableData = null;
before(() => {
  // Load fixture data
  cy.fixture("inputData").then((inputData) => {
    tableData = inputData.tableData;
  });
});

describe("Data Load Functioanlity check", () => {
  // First Step : Visit the website
  it("Website should open", () => {
    cy.visit("https://testpages.herokuapp.com/styled/tag/dynamic-table.html");
  });
  // Second Step : Check whether the website opened or not
  it("Table Heading should be visible", () => {
    cy.contains("h1", "Dynamic HTML TABLE Tag").should("be.visible");
  });
  // Check whether the table data button is visible or not
  it("Table Data button should be visible", () => {
    cy.contains("Table Data").should("be.visible");
  });
  // Check whether the table data button is clickable or not
  it("Table Data button should be clickable", () => {
    cy.contains("Table Data").click();
  });
  // Check whether the text area is visible or not
  it("Text Area should be visible", () => {
    cy.get("textarea#jsondata").should("be.visible");
  });
  // Need to clear the text area before typing new data
  it("Text Area should be Cleared", () => {
    cy.get("textarea#jsondata").clear();
  });
  // Check whether the text area is typable or not
  it("Text Area should be typable", () => {
    // Converting Json data to string type
    cy.get("textarea#jsondata").type(JSON.stringify(tableData), {
      parseSpecialCharSequences: false,
    });
  });
  // Refresh table button should be visible
  it("Refresh Table button should be visible", () => {
    cy.contains("Refresh Table").should("be.visible");
  });
  // Refresh table button should be clickable
  it("Refresh Table button should be clickable", () => {
    cy.contains("Refresh Table").click();
  });
});

// In this test suits the actual assertions were made to test table data is matching with the form data or not
describe("Assertions for the data loaded to the table", () => {
  // Check whether the Caption of the table name is "Dynamic Table"
  it("Caption of the Table should be 'Dynamic Table'", () => {
    cy.contains("Dynamic Table").should("be.visible");
  });
  // Check whether the Dynamic table is visible or not
  it("Dynamic table should be visible", () => {
    cy.get("table#dynamictable").should("be.visible");
  });
  // Check whether the dynamic table is having the expected data by checking all rows and columns of the table
  it("Dynamic table should have the expected data", () => {
    // transformation logic----------------------start here-------------->>
    let table = [];

    // pushing all the headings to first row of the 2d array named table
    table.push(Object.keys(tableData[0]));
    for (let i = 0; i < tableData.length; i++) {
      // pushing the rest of the rows to the 2d table array
      let row = Object.values(tableData[i]);
      table.push(row);
    }

    // 2d array--data transformation logic---ends here------------->>
    // Located the table using the selector with tag and id combination
    cy.get("table#dynamictable").within(() => {
      // Iterating over each and every row
      cy.get("tr").each((row, rowIndex) => {
        // Fixing the element to check whether td or th depending on the row
        const element = rowIndex !== 0 ? "td" : "th";
        cy.wrap(row).within(() => {
          // Iterating over every cell of the row
          cy.get(element).each((cell, cellIndex) => {
            cy.wrap(cell)
              .invoke("text")
              .then((text) => {
                // trimming the extra white spaces if any
                text = text.trim();
                // Converting the any type of data to string
                const expectedText = table[rowIndex][cellIndex] + "";
                const assertionDescription = `Row ${rowIndex}, Cell ${cellIndex}`;
                // Assertions for each and every cell
                it(`Dynamic table should have the expected data - ${assertionDescription}`, () => {
                  expect(text).to.equal(expectedText);
                });
              });
          });
        });
      });
    });
  });
});
