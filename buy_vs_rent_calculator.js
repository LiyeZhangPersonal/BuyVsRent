function calculateBuyVsRent() {
    var homePrice = parseFloat(document.getElementById('homePrice').value.replace(/,/g, ''));
    var downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, ''));
    var loanTermYears = parseFloat(document.getElementById('loanTerm').value.replace(/,/g, ''));
    var loanTerm = loanTermYears * 12;
    var interestRate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, '')) / 100 / 12;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value.replace(/,/g, ''));
    var appreciationRate = parseFloat(document.getElementById('appreciationRate').value.replace(/,/g, '')) / 100;
    var sellingCosts = parseFloat(document.getElementById('sellingCosts').value.replace(/,/g, '')) / 100;
    var propertyTaxRate = parseFloat(document.getElementById('propertyTaxRate').value.replace(/,/g, '')) / 100;
    var initialBuyingCosts = parseFloat(document.getElementById('initialBuyingCosts').value.replace(/,/g, '')) / 100;
    var annualInsuranceCosts = parseFloat(document.getElementById('annualInsuranceCosts').value.replace(/,/g, '')) / 100;
    var annualMaintenanceCosts = parseFloat(document.getElementById('annualMaintenanceCosts').value.replace(/,/g, '')) / 100;
    var monthlyCommonCharges = parseFloat(document.getElementById('monthlyCommonCharges').value.replace(/,/g, ''));
    var marginalTaxRate = parseFloat(document.getElementById('marginalTaxRate').value.replace(/,/g, ''));
    var saltCapRemaining = parseFloat(document.getElementById('saltCapRemaining').value.replace(/,/g, ''));
    var filingMarried = document.getElementById('filingMarried').checked;

    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
    var additionalBuyingCosts = homePrice * initialBuyingCosts;

    var breakdown = "<h3>Yearly Breakdown</h3><table border='1'><tr><th>Year</th><th>Buy Outlay</th><th>Home Price</th><th>Mortgage Balance</th><th>Home Equity</th><th>Rent Paid</th><th>Total Cost After Selling</th><th>Net Savings from Buying</th><th>Tax Savings</th></tr>";
    var cumulativeBuyingCost = downPayment + additionalBuyingCosts;
    var cumulativeRentingCost = 0;
    var remainingLoanBalance = loanAmount;

    for (var year = 1; year <= loanTermYears; year++) {
        var homeValue = homePrice * Math.pow(1 + appreciationRate, year);
        var yearlyPropertyTax = homeValue * propertyTaxRate;
        var yearlyInsuranceCost = homeValue * annualInsuranceCosts;
        var yearlyMaintenanceCost = homeValue * annualMaintenanceCosts;
        var yearlyCommonCharges = monthlyCommonCharges * 12;
        var yearlyMortgage = (monthlyMortgage + yearlyPropertyTax / 12) * 12 + yearlyInsuranceCost + yearlyMaintenanceCost + yearlyCommonCharges;
        var yearlyRent = monthlyRent * 12;

        var interestPaidForYear = 0;
        for (var month = 1; month <= 12; month++) {
            var interestPayment = remainingLoanBalance * interestRate;
            interestPaidForYear += interestPayment;
            remainingLoanBalance -= (monthlyMortgage - interestPayment);
        }

		var taxSavings = calculateTaxSavings(interestPaidForYear, yearlyPropertyTax, saltCapRemaining, marginalTaxRate, filingMarried, remainingLoanBalance, interestRate);
        cumulativeBuyingCost += yearlyMortgage - taxSavings;
        cumulativeRentingCost += yearlyRent;

        var homeEquity = homeValue - remainingLoanBalance;
        var totalCostAfterSelling = cumulativeBuyingCost - (homeEquity * (1 - sellingCosts));
        var netSavingsFromBuying = cumulativeRentingCost - totalCostAfterSelling;

        breakdown += "<tr><td>" + year + "</td><td>$" + cumulativeBuyingCost.toFixed(2) +
                     "</td><td>$" + homeValue.toFixed(2) + "</td><td>$" + remainingLoanBalance.toFixed(2) +
                     "</td><td>$" + homeEquity.toFixed(2) + "</td><td>$" + cumulativeRentingCost.toFixed(2) +
                     "</td><td>$" + totalCostAfterSelling.toFixed(2) + "</td><td>$" + netSavingsFromBuying.toFixed(2) +
                     "</td><td>$" + taxSavings.toFixed(2) + "</td></tr>";
    }

    breakdown += "</table>";

    var finalHomeValue = homePrice * Math.pow(1 + appreciationRate, loanTermYears);
    var totalSellingCosts = finalHomeValue * sellingCosts;
    var netProceeds = finalHomeValue - totalSellingCosts - remainingLoanBalance;

    var totalCostBuying = downPayment + additionalBuyingCosts + monthlyMortgage * loanTerm - netProceeds + (finalHomeValue * propertyTaxRate * loanTermYears);
    var totalCostRenting = monthlyRent * loanTerm;

    var result = totalCostBuying < totalCostRenting ? "Buying is better" : "Renting is better";

    document.getElementById('result').innerHTML = result + "<br>" +
                                                   "Total cost of buying: $" + totalCostBuying.toFixed(2) + "<br>" +
                                                   "Total cost of renting: $" + totalCostRenting.toFixed(2) +
                                                   breakdown;
}
