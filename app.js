const storageCtrl = (function(){
    return {
        storeItem: function(item) {
            let items;
            if(localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            items.push(item)
            localStorage.setItem('items', JSON.stringify(items))
        }
    }
})()
const UICtrl = (function(){
    const UISelectors = {
        //input

        // Buttons
        addExpenseBtn: document.querySelector('.addExpenseBtn'),
        addIncomeBtn: document.querySelector('.addIncomeBtn'),
        // Fields
        expenseDateInput: document.querySelector('#addExpenseModal #dateInput'),
        expenseDescriptionInput: document.querySelector('#addExpenseModal #descriptionInput'),
        expenseAmountInput: document.querySelector('#addExpenseModal #amountInput'),
        incomeDateInput: document.querySelector('#addIncomeModal #dateInput'),
        incomeDescriptionInput: document.querySelector('#addIncomeModal #descriptionInput'),
        incomeAmountInput: document.querySelector('#addIncomeModal #amountInput'),

        

        //output
        tableBody: document.getElementById("outputTable"),
        totalIncome: document.getElementById('totalIncome'),
        totalExpense: document.getElementById('totalExpense'),
        netProfit: document.getElementById('netProfit'),
        percentageProfit: document.getElementById('percentProfit'),
        remark: document.getElementById('remark')
    }
    // function populateTable(item){
    //     const table = UISelectors.tableBody;
    //     let html = ``

    //     item.forEach((itemm)=>{
    //         html += `
    //         <tr class=${itemm.transaction === "expense"? "table-danger" : "table-success"}>
    //             <th scope="row">${itemm.ID + 1}</th>
    //             <td>${itemm.date}</td>
    //             <td>${itemm.description}</td>
    //             <td>${itemm.amount}</td>
    //         </tr>`
    //     })

    //     table.innerHtml += html;

    // }
    function addItemToTable(item){
        let html = ``
        const table = UISelectors.tableBody

        html += `<tr class=${item.transaction === "expense"? "table-danger" : "table-success"}>
        <th scope="row">${item.id + 1}</th>
        <td>${item.date}</td>
        <td>${item.description}</td>
        <td>${item.amount}</td>
    </tr>`
    table.innerHTML += html
    }
    return {
        displayTotalIncome: function(income){
            UISelectors.totalIncome.textContent = income
        },
        displayTotalExpense: function(expense){
            UISelectors.totalExpense.textContent = expense
        },
        displayNetProfit: function(netProfit){
            UISelectors.netProfit.textContent = netProfit
        },
        clearInput: function(){
            UISelectors.expenseDateInput.value = '';
            UISelectors.expenseDescriptionInput.value = '';
            UISelectors.expenseAmountInput.value = '';
            UISelectors.incomeDateInput.value = '';
            UISelectors.incomeDescriptionInput.value = '';
            UISelectors.incomeAmountInput.value = '';
        },
        displayPercentageProfit: function(percent){
            UISelectors.percentageProfit.textContent = percent
        },
        displayRemarks: function(net){
            let remark = net>0?"You are in profit" : "Loss"
            UISelectors.remark.textContent = remark
        },
        displayOutputNumers: function(){
            UICtrl.clearInput()
            const net = itemCtrl.getNetProfit()
            UICtrl.displayNetProfit(net)
            const percent = itemCtrl.getPercentageProfit()
            UICtrl.displayPercentageProfit(percent)
            UICtrl.displayRemarks(net)
        },
        UISelectors,
        addItemToTable
    }
})()
const itemCtrl = (function(){
    // local variable
    function Item(id, date, description, amount, transaction) {
        this.id = id
        this.date = date
        this.description = description
        this.amount = amount
        this.transaction = transaction
    }
    //Data structure 
    const data = {
        items: [
            // Get this from local storage
            // {id: 1, date: "30/20/23", description: "chow", amount: 3000, transaction: "income"},
            // {id: 2, date: "30/20/23", description: "chow", amount: 2000, transaction: "expense"},
            // {id: 3, date: "30/20/23", description: "chow", amount: 2000, transaction: "income"}
        ],
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        percentageProfit: 0
    }

    return {
        addItemToDataStructure: function(date, description, amount, transaction) {
            let ID;
            // Create ID
            if(data.items.length > 0){
            ID = data.items[data.items.length - 1].id + 1;
            } else {
            ID = 0;
            }
            item = new Item(ID, date, description, amount, transaction)

            data.items.push(item)
            return item
        },
        getTotalIncome: function(){
            let total = 0;

            data.items.forEach((item)=>{
                // check if item is an income
                if(item.transaction === 'income'){
                    total += item.amount;
                }
            })
            data.totalIncome = total
            return data.totalIncome
        },
        getTotalExpense: function(){
            let total = 0;

            data.items.forEach((item)=>{
                // check if item is an expense
                if(item.transaction === 'expense'){
                    total += item.amount;
                }
            })
            data.totalExpense = total
            return data.totalExpense
        },
        getNetProfit: function(){
            let net = 0
            net = data.totalIncome - data.totalExpense
            return net
        },
        getPercentageProfit: function(){
            let percent = 0
            percent = ((itemCtrl.getNetProfit()/data.totalIncome)*100).toFixed(3)
            data.percentageProfit = percent
            return data.percentageProfit
        },
        data
    }
})()
const app = (function(storageCtrl, UICtrl, itemCtrl){
    // Add event listeners
    function loadEventListeners(){
        UICtrl.UISelectors.addExpenseBtn.addEventListener('click', addExpense)
        UICtrl.UISelectors.addIncomeBtn.addEventListener('click', addIncome)
    }
    // Add expense
    function addExpense(e){
        const date = UICtrl.UISelectors.expenseDateInput.value
        const description = UICtrl.UISelectors.expenseDescriptionInput.value
        const amount = parseFloat(UICtrl.UISelectors.expenseAmountInput.value)

        if(date !==  '' && description !== '' && amount !== '') {
            const newItem = itemCtrl.addItemToDataStructure(date, description, amount, "expense")
            UICtrl.addItemToTable(newItem)
            // Display total expense
            const totalExpense = itemCtrl.getTotalExpense()
            UICtrl.displayTotalExpense(totalExpense)

            
            UICtrl.displayOutputNumers()
            // Add to LS
            storageCtrl.storeItem(newItem)
            
            e.preventDefault()
        }
        
    }
    // Add income
    function addIncome(e){
        const date = UICtrl.UISelectors.incomeDateInput.value
        const description = UICtrl.UISelectors.incomeDescriptionInput.value
        const amount = parseFloat(UICtrl.UISelectors.incomeAmountInput.value)


        if(date !==  '' && description !== '' && amount !== '') {
            const newItem = itemCtrl.addItemToDataStructure(date, description, amount, "income")
            UICtrl.addItemToTable(newItem)
            // Display total income
            const totalIncome = itemCtrl.getTotalIncome()
            UICtrl.displayTotalIncome(totalIncome)
                    
            UICtrl.displayOutputNumers()
            // Add to LS
            storageCtrl.storeItem(newItem)
        }
       

        e.preventDefault()
    }

    
    return {
        init: function(){
            loadEventListeners()

            
        }
    }
})(storageCtrl, UICtrl, itemCtrl)

app.init()

