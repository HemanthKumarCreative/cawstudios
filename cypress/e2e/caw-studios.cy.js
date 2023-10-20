let inputData = [
  { name: "Bob", age: 20, gender: "male" },
  { name: "George", age: 42, gender: "male" },
  { name: "Sara", age: 42, gender: "female" },
  { name: "Conor", age: 40, gender: "male" },
  { name: "Jennifer", age: 42, gender: "female" },
];
let outerArr = [];
for (let i = 0; i < inputData.length; i++) {
  let innerArr = Object.values(inputData[i]);
  outerArr.push(innerArr);
}

describe("Data Load Functioanlity check", () => {
  it("Website should open", () => {
    cy.visit("https://testpages.herokuapp.com/styled/tag/dynamic-table.html");
  });

  it("Table Heading should be visible", () => {
    cy.contains("h1", "Dynamic HTML TABLE Tag").should("be.visible");
  });

  it("Table Data button should be visible", () => {
    cy.contains("Table Data").should("be.visible");
  });

  it("Table Data button should be clickable", () => {
    cy.contains("Table Data").click();
  });

  it("Text Area should be visible", () => {
    cy.get("textarea#jsondata").should("be.visible");
  });

  it("Text Area should be Cleared", () => {
    cy.get("textarea#jsondata").clear();
  });

  it("Text Area should be typable", () => {
    cy.get("textarea#jsondata").type(JSON.stringify(inputData), {
      parseSpecialCharSequences: false,
    });
  });

  it("Refresh Table button should be visible", () => {
    cy.contains("Refresh Table").should("be.visible");
  });

  it("Refresh Table button should be clickable", () => {
    cy.contains("Refresh Table").click();
  });
});

describe("Assertions for the data loaded to the table", () => {
  it("Caption of the Table should be 'Dynamic Table'", () => {
    cy.contains("Dynamic Table").should("be.visible");
  });

  it("Dynamic table should be visible", () => {
    cy.get("table#dynamictable").should("be.visible");
  });

  it("Dynamic table should be have the expected data", () => {
    cy.get("table#dynamictable").within(() => {
      cy.get("tr").each((row, rowIndex) => {
        if (rowIndex !== 0) {
          cy.wrap(row).within(() => {
            cy.get("td").each((cell, cellIndex) => {
              cy.wrap(cell)
                .invoke("text")
                .then((text) => {
                  text = text.trim();
                  const expectedText = outerArr[rowIndex - 1][cellIndex];
                  expect(text).to.equal(expectedText + "");
                });
            });
          });
        } else {
          cy.wrap(row).within(() => {
            cy.get("th").each((cell, cellIndex) => {
              cy.wrap(cell)
                .invoke("text")
                .then((text) => {
                  if (rowIndex === 0 && cellIndex === 0) {
                    expect(text).to.equal("name");
                  } else if (rowIndex === 0 && cellIndex === 1) {
                    expect(text).to.equal("age");
                  } else if (rowIndex === 0 && cellIndex === 2) {
                    expect(text).to.equal("gender");
                  }
                });
            });
          });
        }
      });
    });
  });
});
