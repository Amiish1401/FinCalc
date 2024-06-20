document.addEventListener('DOMContentLoaded', function() {
    // DCF Calculator
    const dcfForm = document.getElementById('dcfForm');
    if (dcfForm) {
        dcfForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentRevenue = parseFloat(document.getElementById('current_revenue').value);
            const growthRate = parseFloat(document.getElementById('growth_rate').value) / 100;
            const years = parseInt(document.getElementById('years').value);
            const discountRate = parseFloat(document.getElementById('discount_rate').value) / 100;

            let dcf = 0;
            for (let i = 1; i <= years; i++) {
                dcf += currentRevenue * Math.pow(1 + growthRate, i) / Math.pow(1 + discountRate, i);
            }

            document.getElementById('dcfResult').innerText = `DCF Value: ₹${dcf.toFixed(2)} crores`;
        });
    }

    // Loan Calculator
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const principal = parseFloat(document.getElementById('principal').value);
            const rate = parseFloat(document.getElementById('rate').value) / 100 / 12;
            const time = parseInt(document.getElementById('time').value) * 12;

            const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);

            document.getElementById('loanResult').innerText = `EMI: ₹${emi.toFixed(2)} per month`;
        });
    }

    // ROI Calculator
    const roiForm = document.getElementById('roiForm');
    if (roiForm) {
        roiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const initialInvestment = parseFloat(document.getElementById('initial_investment').value);
            const netProfit = parseFloat(document.getElementById('net_profit').value);
            const investmentTime = parseInt(document.getElementById('investment_time').value);

            const roi = (netProfit / initialInvestment) * 100;
            const annualizedROI = Math.pow(1 + roi / 100, 1 / investmentTime) - 1;

            document.getElementById('roiResult').innerText = `ROI: ${roi.toFixed(2)}%\nAnnualized ROI: ${(annualizedROI * 100).toFixed(2)}%`;
        });
    }

    // NPV & IRR Calculator
    const npvIrrForm = document.getElementById('npvIrrForm');
    if (npvIrrForm) {
        npvIrrForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const initialInvestment = parseFloat(document.getElementById('initial_investment').value);
            const cashFlows = document.getElementById('cash_flows').value.split(',').map(parseFloat);
            const discountRate = parseFloat(document.getElementById('discount_rate').value) / 100;

            let npv = -initialInvestment;
            for (let i = 0; i < cashFlows.length; i++) {
                npv += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
            }

            document.getElementById('npvIrrResult').innerText = `NPV: ₹${npv.toFixed(2)} crores`;

            // Calculate IRR
            const irr = calculateIRR([-initialInvestment, ...cashFlows]);
            document.getElementById('npvIrrResult').innerText += `\nIRR: ${(irr * 100).toFixed(2)}%`;
        });
    }

    function calculateIRR(cashFlows) {
        let irr = 0.1; // Initial guess
        let npv = 1;
        const epsilon = 0.0001;
        while (Math.abs(npv) > epsilon) {
            npv = cashFlows.reduce((acc, curr, i) => acc + curr / Math.pow(1 + irr, i), 0);
            irr -= npv / cashFlows.reduce((acc, curr, i) => acc - i * curr / Math.pow(1 + irr, i + 1), 0);
        }
        return irr;
    }
});
