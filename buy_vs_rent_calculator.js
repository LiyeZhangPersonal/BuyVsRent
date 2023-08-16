function calculateBuyVsRent() {
    // Retrieve values from the form
    var homePrice = parseFloat(document.getElementById('homePrice').value.replace(/,/g, ''));
    var downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, ''));
    var loanTerm = parseInt(document.getElementById('loanTerm').value);
    var interestRate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, '')) / 100 / 12;
    var homeAppreciationRate = parseFloat(document.getElementById('homeAppreciationRate').value.replace(/,/g, '')) / 100;
    var sellingCosts = parseFloat(document.getElementById('sellingCosts').value.replace(/,/g, '')) / 100;
    var propertyTaxRate = parseFloat(document.getElementById('propertyTaxRate').value.replace(/,/g, '')) / 100;
    var initialBuyingCosts = parseFloat(document.getElementById('initialBuyingCosts').value.replace(/,/g, '')) / 100;
    var annualInsuranceCosts = parseFloat(document.getElementById('annualInsuranceCosts').value.replace(/,/g, '')) / 100;
    var annualMaintenanceCosts = parseFloat(document.getElementById('annualMaintenanceCosts').value.replace(/,/g, '')) / 100;
    var monthlyCommonCharges = parseFloat(document.getElementById('monthlyCommonCharges').value.replace(/,/g, ''));
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value.replace(/,/g, ''));
    var annualRentIncrease = parseFloat(document.getElementById('annualRentIncrease').value.replace(/,/g, '')) / 100;
    var marginalTaxRate = parseFloat(document.getElementById('marginalTaxRate').value.replace(/,/g, '')) / 100;
    var saltCapRemaining = parseFloat(document.getElementById('saltCapRemaining').value.replace(/,/g, ''));
    var filingMarried = document.getElementById('filingMarried').checked;

    // Additional calculations
    var loanAmount = homePrice - downPayment;
    var monthlyMortgagePayment = loanAmount * (interestRate * Math.pow(1 + interestRate, loanTerm * 12)) / (Math.pow(1 + interestRate, loanTerm * 12) - 1);
    var currentYearlyRent = monthlyRent * 12;
    var cumulativeRent = 0;
    var cumulativeBuyingCost = downPayment + (homePrice * initialBuyingCosts);
    var remainingLoanBalance = loanAmount;

    // Result table
    var resultTable = '<table><tr><th>Year</th><th>Buy Outlay</th><th>Home Price</th><th>Mortgage Balance</th><th>Home Equity</th><th>Rent Paid</th><th>Total Cost after Selling</th><th>Net Savings from Buying</th><th>Tax Savings</th></tr>';

    for (var year = 1; year <= loanTerm; year++) {
        var yearlyRent = currentYearlyRent * Math.pow(1 + annualRentIncrease, year - 1);
        cumulativeRent += yearlyRent;

        var yearlyMortgage = monthlyMortgagePayment * 12;
        var interestPaidForYear = 0;
        for (var month = 1; month <= 12; month++) {
            var interestPaidThisMonth = remainingLoanBalance * interestRate;
            interestPaidForYear += interestPaidThisMonth;
            remainingLoanBalance -= (monthlyMortgagePayment - interestPaidThisMonth);
        }
        var yearlyPropertyTax = homePrice * propertyTaxRate;
        var yearlyInsurance = homePrice * annualInsuranceCosts;
        var yearlyMaintenance = homePrice * annualMaintenanceCosts;
        yearlyMortgage += yearlyPropertyTax + yearlyInsurance + yearlyMaintenance + (monthlyCommonCharges * 12);

        var taxSavings = calculateTaxSavings(interestPaidForYear, yearlyPropertyTax, saltCapRemaining, marginalTaxRate, filingMarried, interestRate);
        cumulativeBuyingCost += yearlyMortgage;
        cumulativeBuyingCost -= taxSavings;

        homePrice *= (1 + homeAppreciationRate);
        var homeEquity = homePrice - remainingLoanBalance;
        var totalCostAfterSelling = cumulativeBuyingCost - (homeEquity - (homePrice * sellingCosts));
        var netSavingsFromBuying = cumulativeRent - totalCostAfterSelling;

        resultTable += '<tr><td>' + year + '</td><td>' + cumulativeBuyingCost.toFixed(2) + '</td><td>' + homePrice.toFixed(2) + '</td><td>' + remainingLoanBalance.toFixed(2) + '</td><td>' + homeEquity.toFixed(2) + '</td><td>' + cumulativeRent.toFixed(2) + '</td><td>' + totalCostAfterSelling.toFixed(2) + '</td><td>' + netSavingsFromBuying.toFixed(2) + '</td><td>' + taxSavings.toFixed(2) + '</td></tr>';
    }

    resultTable += '</table>';

    // Display the result
    document.getElementById('result').innerHTML = resultTable;
}
