from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dcf', methods=['GET', 'POST'])
def dcf():
    if request.method == 'POST':
        current_revenue = float(request.form['current_revenue'])
        growth_rate = float(request.form['growth_rate']) / 100
        years = int(request.form['years'])
        discount_rate = float(request.form['discount_rate']) / 100

        dcf_value = 0
        for i in range(1, years + 1):
            revenue = current_revenue * ((1 + growth_rate) ** i)
            dcf_value += revenue / ((1 + discount_rate) ** i)

        return jsonify({'dcf_value': round(dcf_value, 2)})
    return render_template('dcf.html')

@app.route('/loan', methods=['GET', 'POST'])
def loan():
    if request.method == 'POST':
        principal = float(request.form['principal'])
        rate = float(request.form['rate'])
        time = int(request.form['time'])

        monthly_rate = rate / 12 / 100
        number_of_payments = time * 12
        emi = principal * monthly_rate * (1 + monthly_rate) ** number_of_payments / ((1 + monthly_rate) ** number_of_payments - 1)
        total_payment = emi * number_of_payments
        total_interest = total_payment - principal

        return jsonify({
            'emi': round(emi, 2),
            'total_interest': round(total_interest, 2),
            'total_payment': round(total_payment, 2)
        })
    return render_template('loan.html')

@app.route('/roi', methods=['GET', 'POST'])
def roi():
    if request.method == 'POST':
        initial_investment = float(request.form['initial_investment'])
        net_profit = float(request.form['net_profit'])
        investment_time = int(request.form['investment_time'])

        roi = (net_profit - initial_investment) / initial_investment * 100
        annual_roi = roi / investment_time

        return jsonify({
            'roi': round(roi, 2),
            'annual_roi': round(annual_roi, 2)
        })
    return render_template('roi.html')

@app.route('/npv_irr', methods=['GET', 'POST'])
def npv_irr():
    if request.method == 'POST':
        initial_investment = float(request.form['initial_investment'])
        cash_flows = list(map(float, request.form['cash_flows'].split(',')))
        discount_rate = float(request.form['discount_rate']) / 100

        npv = -initial_investment
        for i, cash_flow in enumerate(cash_flows):
            npv += cash_flow / (1 + discount_rate) ** (i + 1)

        def irr_function(values):
            def npv_rate(rate):
                npv = 0
                for i, value in enumerate(values):
                    npv += value / (1 + rate) ** i
                return npv

            return npv_rate

        irr_values = [-initial_investment] + cash_flows
        irr = np.irr(irr_values) * 100

        return jsonify({
            'npv': round(npv, 2),
            'irr': round(irr, 2)
        })
    return render_template('npv_irr.html')

if __name__ == '__main__':
    app.run(debug=True)
