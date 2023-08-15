function calculateBuyVsRent() {
    var homePrice = parseFloat(document.getElementById('homePrice').value.replace(/,/g, ''));
    var downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, ''));
    var loanTermYears = parseFloat(document.getElementById('loanTerm').value.replace(/,/g, ''));
    var loanTerm = loanTermYears * 12;
    var interestRate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, '')) / 100 / 12;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value.replace(/,/g, ''));
    var appreciationRate = parseFloat(document.getElementById('appreciationRate').value.replace(/,/g, '')) / 100;
    var sellingCosts = parseFloat(document.getElementById('sellingCosts').value.replace(/,/g, '')) / 100;

    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);

    var breakdown = "<h3>Yearly Breakdown</h3><table border='1'><tr><th>Year</th><th>Buy Outlay</th><th>Home Price</th><th>Mortgage Balance</th><th>Home Equity</th><th>Rent Paid</th><th>Total Cost After Selling</th><th>Net Savings from Buying</th></tr>";
    var cumulativeBuyingCost = downPayment;
    var cumulativeRentingCost = 0;
    var remainingLoanBalance = loanAmount;

    for (var year = 1; year <= loanTermYears; year++) {
        var yearlyMortgage = monthlyMortgage * 12;
        var yearlyRent = monthlyRent * 12;

        for (var month = 1; month <= 12; month++) {
            var interestPayment = remainingLoanBalance * interestRate;
            var principalPayment = monthlyMortgage - interestPayment;
            remainingLoanBalance -= principalPayment;
        }

        cumulativeBuyingCost += yearlyMortgage;
        cumulativeRentingCost += yearlyRent;

        var homeValue = homePrice * Math.pow(1 + appreciationRate, year);
        var homeEquity = homeValue - remainingLoanBalance;
        var totalCostAfterSelling = cumulativeBuyingCost - (homeEquity * (1 - sellingCosts));
        var netSavingsFromBuying = cumulativeRentingCost - totalCostAfterSelling;

        breakdown += "<tr><td>" + year + "</td><td>$" + cumulativeBuyingCost.toFixed(2) +
                     "</td><td>$" + homeValue.toFixed(2) + "</td><td>$" + remainingLoanBalance.toFixed(2) +
                     "</td><td>$" + homeEquity.toFixed(2) + "</td><td>$" + cumulativeRentingCost.toFixed(2) +
                     "</td><td>$" + totalCostAfterSelling.toFixed(2) + "</td><td>$" + netSavingsFromBuying.toFixed(2) + "</td></tr>";
    }

    breakdown += "</table>";

    var finalHomeValue = homePrice * Math.pow(1 + appreciationRate, loanTermYears);
    var totalSellingCosts = finalHomeValue * sellingCosts;
    var netProceeds = finalHomeValue - totalSellingCosts - remainingLoanBalance;

    var totalCostBuying = downPayment + monthlyMortgage * loanTerm - netProceeds;
    var totalCostRenting = monthlyRent * loanTerm;

    var result = totalCostBuying < totalCostRenting ? "Buying is better" : "Renting is better";

    document.getElementById('result').innerHTML = result + "<br>" +
                                                   "Total cost of buying: $" + totalCostBuying.toFixed(2) + "<br>" +
                                                   "Total cost of renting: $" + totalCostRenting.toFixed(2) +
                                                   breakdown;
}
