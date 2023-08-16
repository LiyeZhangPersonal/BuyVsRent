function calculateTaxSavings(interestPaid, propertyTaxesPaid, saltCapRemaining, marginalTaxRate, filingMarried, interestRate) {
    // Constants
    var standardDeduction = filingMarried ? 27700 : 13850;
    var saltCap = 10000;
    var maxMortgageDebtForInterestDeduction = 750000; // Apply interest deduction only to the first $750,000 of mortgage debt

    // Calculate deductible interest
    var deductibleInterest = Math.min(interestPaid, maxMortgageDebtForInterestDeduction * interestRate * 12);

    // Calculate SALT deduction
    var saltDeduction = Math.min(saltCapRemaining, propertyTaxesPaid);

    // Calculate reduction in taxable income
    var reductionInTaxableIncome = (deductibleInterest + saltDeduction + saltCap) - standardDeduction;

    // Calculate tax savings
    var taxSavings = reductionInTaxableIncome * marginalTaxRate;

    return taxSavings > 0 ? taxSavings : 0; // Ensure tax savings are non-negative
}
