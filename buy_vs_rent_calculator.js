function formatNumber(num) {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateBuyVsRent() {
    // Retrieve input values
    var homePrice = parseFloat(document.getElementById("homePrice").value.replace(/,/g, ''));
    var downPayment = parseFloat(document.getElementById("downPayment").value.replace(/,/g, ''));
    var loanTerm = parseInt(document.getElementById("loanTerm").value);
    var interestRate = parseFloat(document.getElementById("interestRate").value) / 100;
    var monthlyRent = parseFloat(document.getElementById("monthlyRent").value.replace(/,/g, ''));
    var homeAppreciationRate = parseFloat(document.getElementById("homeAppreciationRate").value) / 100;
    var sellingCostsRate = parseFloat(document.getElementById("sellingCosts").value) / 100;
    var propertyTaxRate = parseFloat(document.getElementById("propertyTaxRate").value) / 100;
    var initialBuyingCostsRate = parseFloat(document.getElementById("initialBuyingCosts").value) / 100;
    var annualInsuranceCostsRate = parseFloat(document.getElementById("annualInsuranceCosts").value) / 100;
    var annualMaintenanceCostsRate = parseFloat(document.getElementById("annualMaintenanceCosts").value) / 100;
    var monthlyCommonCharges = parseFloat(document.getElementById("monthlyCommonCharges").value.replace(/,/g, ''));
    var annualRentIncrease = parseFloat(document.getElementById("annualRentIncrease").value) / 100;
    var investmentInterestRate = parseFloat(document.getElementById("investmentInterestRate").value) / 100;
    var marginalTaxRate = parseFloat(document.getElementById("marginalTaxRate").value) / 100;
    var saltCapRemaining = parseFloat(document.getElementById("saltCapRemaining").value.replace(/,/g, ''));
    var filingMarried = document.getElementById("filingMarried").checked;

    // Other variables
    var remainingLoanBalance = homePrice - downPayment;
    var monthlyInterestRate = interestRate / 12;
    var monthlyPayment = remainingLoanBalance * (monthlyInterestRate + (monthlyInterestRate / (Math.pow(1 + monthlyInterestRate, loanTerm * 12) - 1)));

    // Result variables
    var cumulativeBuyingCost = downPayment + (homePrice * initialBuyingCostsRate);
    var cumulativeRent = 0;
    var investmentAccountBalance = 0;
	
    // Initial investment account balance
    var initialInvestment = downPayment + (homePrice * initialBuyingCostsRate) - monthlyRent * 12;
    var investmentAccountBalance = initialInvestment;

    // Result table
    var resultTable = '<table><tr><th>Year</th><th>Buy Outlay</th><th>Home Price</th><th>Mortgage Balance</th><th>Home Equity</th><th>Rent Paid</th><th>Tax Savings</th><th>Investment Account</th><th>Net Proceeds After Sale</th><th>Investment vs Sale Proceeds Difference</th></tr>';

    for (var year = 1; year <= loanTerm; year++) {
        var interestPaid = remainingLoanBalance * interestRate;
        var propertyTaxesPaid = homePrice * propertyTaxRate;
        var annualInsuranceCosts = homePrice * annualInsuranceCostsRate;
        var annualMaintenanceCosts = homePrice * annualMaintenanceCostsRate;

        var annualBuyingCost = monthlyPayment * 12 + propertyTaxesPaid + annualInsuranceCosts + annualMaintenanceCosts + monthlyCommonCharges * 12;
        cumulativeBuyingCost += annualBuyingCost;

        var taxSavings = calculateTaxSavings(interestPaid, propertyTaxesPaid, saltCapRemaining, marginalTaxRate, filingMarried, monthlyInterestRate);
        cumulativeBuyingCost -= taxSavings;

        var annualRentCost = monthlyRent * 12;
        cumulativeRent += annualRentCost;

        var netAnnualDifference = annualBuyingCost - annualRentCost - taxSavings;
        investmentAccountBalance = (investmentAccountBalance + netAnnualDifference) * (1 + investmentInterestRate);

        var homeEquity = homePrice - remainingLoanBalance;
        var sellingCosts = homePrice * sellingCostsRate;
        var netProceedsAfterSale = homePrice - sellingCosts - remainingLoanBalance;
        var investmentVsSaleProceedsDifference = investmentAccountBalance - netProceedsAfterSale;

		resultTable += '<tr><td>' + year + '</td><td>' + formatNumber(cumulativeBuyingCost) + '</td><td>' + formatNumber(homePrice) + '</td><td>' + formatNumber(remainingLoanBalance) + '</td><td>' + formatNumber(homeEquity) + '</td><td>' + formatNumber(cumulativeRent) + '</td><td>' + formatNumber(taxSavings) + '</td><td>' + formatNumber(investmentAccountBalance) + '</td><td>' + formatNumber(netProceedsAfterSale) + '</td><td>' + formatNumber(investmentVsSaleProceedsDifference) + '</td></tr>';

        // Update for next iteration
        homePrice *= (1 + homeAppreciationRate);
        monthlyRent *= (1 + annualRentIncrease);
        remainingLoanBalance -= (monthlyPayment * 12 - interestPaid);
    }

    resultTable += '</table>';
    document.getElementById("result").innerHTML = resultTable;
}
