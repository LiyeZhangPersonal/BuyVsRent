function calculateTaxSavings(interestPaid, propertyTaxesPaid, saltCapRemaining, marginalTaxRate, filingMarried, interestRate) {
    var standardDeduction = filingMarried ? 27700 : 13850;
    var saltCap = 10000;
    var maxMortgageDebtForInterestDeduction = 750000;

    // Apply interest deduction only to the first $750,000 of mortgage debt
    var deductibleInterest = Math.min(interestPaid, maxMortgageDebtForInterestDeduction * interestRate);

    var reductionInTaxableIncome =
        deductibleInterest +
        (Math.min(saltCapRemaining, propertyTaxesPaid)) -
        (standardDeduction - saltCap + saltCapRemaining);

    var taxSavings = reductionInTaxableIncome * marginalTaxRate / 100;

    return Math.max(taxSavings, 0); // Ensure tax savings are non-negative
}
