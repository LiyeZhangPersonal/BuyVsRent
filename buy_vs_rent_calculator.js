function calculateBuyVsRent() {
    var homePrice = parseFloat(document.getElementById('homePrice').value.replace(/,/g, ''));
    var downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, ''));
    var loanTerm = parseFloat(document.getElementById('loanTerm').value.replace(/,/g, '')) * 12;
    var interestRate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, '')) / 100 / 12;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value.replace(/,/g, ''));

    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
    
    var totalCostBuying = downPayment + monthlyMortgage * loanTerm;
    var totalCostRenting = monthlyRent * loanTerm;

    var result = totalCostBuying < totalCostRenting ? "Buying is better" : "Renting is better";

    document.getElementById('result').innerHTML = result + "<br>" +
                                                   "Total cost of buying: $" + totalCostBuying.toFixed(2) + "<br>" +
                                                   "Total cost of renting: $" + totalCostRenting.toFixed(2);
}
