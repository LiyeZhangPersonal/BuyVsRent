function calculateBuyVsRent() {
    var homePrice = document.getElementById('homePrice').value;
    var downPayment = document.getElementById('downPayment').value;
    var loanTerm = document.getElementById('loanTerm').value * 12;
    var interestRate = document.getElementById('interestRate').value / 100 / 12;
    var monthlyRent = document.getElementById('monthlyRent').value;

    var loanAmount = homePrice - downPayment;
    var monthlyMortgage = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
    
    var totalCostBuying = downPayment + monthlyMortgage * loanTerm;
    var totalCostRenting = monthlyRent * loanTerm;

    var result = totalCostBuying < totalCostRenting ? "Buying is better" : "Renting is better";

    document.getElementById('result').innerHTML = result + "<br>" +
                                                   "Total cost of buying: $" + totalCostBuying.toFixed(2) + "<br>" +
                                                   "Total cost of renting: $" + totalCostRenting.toFixed(2);
}

