const database = require("./database");

const startbutton = document.getElementById('buttonidstart');
const deletesave = document.getElementById('buttoniddelete');
const label = document.getElementById("labelid");
const checkbox = document.getElementById('myCheck');
const updatebutton = document.getElementById("buttonupdate");
const stopbutton = document.getElementById("buttonidstop");

const profitpercent = document.getElementById('profitinput');
const useradress = document.getElementById('useraddressinput');
const privatekey = document.getElementById('privatekeyinput');
const price = document.getElementById('priceinput');
const usergas = document.getElementById('gasinput');
const time = document.getElementById("timeinput");
const targetadress = document.getElementById('targetinput');
const usergwei = document.getElementById('gweiinput');
const slippage = document.getElementById('slippageinput');
const entertoken = document.getElementById('tokeninput');

const calculatelabel = document.getElementById('calculatelabel');
const calculateinput = document.getElementById('calculategasinput');
const calculatebutton = document.getElementById('calculategasform');


loadfunction();

function loadfunction() {

  console.log("Reloading");

  const fs = require('fs');
  const path = require('path');

  var completedir = path.join(__dirname, '../../');

  let rawdata = fs.readFileSync(path.resolve(completedir, 'login.json'));
  let data = JSON.parse(rawdata);

  console.log(data);

  if (data['profit'] != null || data['profit'] != "") {
    console.log("Its not null");
    console.log(data['profit']);
    profitpercent.value = data['profit'];
    useradress.value = data['useradress'];
    privatekey.value = data['privatekey'];
    price.value = data['price'];
    usergas.value = data['usergas'];
    time.value = data['time'];
    targetadress.value = data['targetaddress'];
    usergwei.value = data['usergwei'];
    slippage.value = data['slippage'];
  }
}

function readwritefile() {
  const fs = require('fs');
  const path = require('path');

  var completedir = path.join(__dirname, '../../');

  let rawdata = fs.readFileSync(path.resolve(completedir, 'login.json'));
  let data = JSON.parse(rawdata);

  if (data['profit'] == null || data['profit'] == "") {
      data['profit'] = profitpercent.value;
      data['privatekey'] = privatekey.value;
      data['price'] = price.value;
      data['time'] = time.value;
      data['useradress'] = useradress.value;
      data['usergas'] = usergas.value;
      data['usergwei'] = usergwei.value;
      data['slippage'] = slippage.value;
      data['targetaddress'] = targetadress.value;

      const stringdata = JSON.stringify(data);

      fs.writeFileSync(path.resolve(completedir, 'login.json'), stringdata);

  } 
}


const ethers = require('ethers'); // "ethers" is a web3 fundamental api developed for general crypto currency. All blockchains(ethereum, binance,, etc) share the same api to handle

startbutton.addEventListener('submit', whenclicked);

deletesave.addEventListener('submit', clickeddelete);

updatebutton.addEventListener('submit', updatelist);

calculatebutton.addEventListener('submit', calculategas);

stopbutton.addEventListener('submit', refresh);

function refresh(e) {
  e.preventDefault();
  document.location.reload(true);

}

function calculategas(e) {
  e.preventDefault();

  try {
    if (calculateinput.value.length > 0) {
      console.log("greater than 1");
      gasamount = parseInt(calculateinput.value);

      bnbprice = 0.00000013 * gasamount;

      calculatelabel.style.color = "green";

      calculatelabel.textContent = "Gas price in bnb:  " + bnbprice
    }
  } catch {
    alert("Please enter a valid gas amount");
  }
}

function updatelist(e) {
  e.preventDefault();

  const fs = require('fs');
  const path = require('path');

  var completedir = path.join(__dirname, '../../');

  let rawdata = fs.readFileSync(path.resolve(completedir, 'login.json'));
  let data = JSON.parse(rawdata);

  data['profit'] = profitpercent.value;
  data['privatekey'] = privatekey.value;
  data['price'] = price.value;
  data['time'] = time.value;
  data['useradress'] = useradress.value;
  data['usergas'] = usergas.value;
  data['targetaddress'] = targetadress.value;
  data['usergwei'] = usergwei.value;
  data['slippage'] = slippage.value;

  const stringdata = JSON.stringify(data);

  fs.writeFileSync(path.resolve(completedir, 'login.json'), stringdata);


  label.textContent = "";

  label.textContent = "Information updated!";
}

function clickeddelete(e) {
  e.preventDefault();

  const fs = require('fs');
  const path = require('path');

  var completedir = path.join(__dirname, '../../');

  let rawdata = fs.readFileSync(path.resolve(completedir, 'login.json'));
  let data = JSON.parse(rawdata);

  data['profit'] = null;
  data['privatekey'] = null;
  data['price'] = null;
  data['time'] = null;
  data['useradress'] = null;
  data['usergas'] = null;
  data['targetaddress'] = null;
  data['usergwei'] = null;
  data['slippage'] = null;

  console.log(data)

  const stringdata = JSON.stringify(data);

  fs.writeFileSync(path.resolve(completedir, 'login.json'), stringdata);

  label.textContent = "";

  label.textContent = "Information Deleted.... You may re-enter your credentials again"
}

function whenclicked(e) {
  e.preventDefault();

  readwritefile();

  try {

    if (String(entertoken.value).length > 1) {
      database.checktoken(entertoken.value, function(mydata) {
        if (mydata == true) {
          alert("Token entered successfully");
  
          label.textContent = "";
          label.style.color = "green";
          label.textContent = label.textContent + "\n" + "Bot Started!";
          
          var someclass = new myclass(label, useradress, privatekey, price, usergas, profitpercent, time, targetadress, usergwei, slippage, checkbox);
          someclass.detectnewcoins();
          
      } else {
        alert("Please enter a valid token")
        return;
      }
      });
  
    } else {
      alert("Token field cannot be empty!");
      return;
    }

  } catch {

    console.log("Please stop the bot before trying again");

  }
}

class myclass {
    constructor(labelobj, useraddress, privatekey, price, usergas, profit, time, target, gwei, slippage, checkbox) {
        
        this.profit = profit;
        this.label = labelobj;
        this.useraddress = useraddress;
        this.privatekey = privatekey;
        this.price = price;
        this.time = time;
        this.target = target;

        this.mygasPrice = gwei.value;
        this.mygaslimit = parseInt(usergas.value);
        this.myslippage = parseInt(slippage.value);
        this.checkbox = checkbox;

        console.log("this is slippage: " + this.myslippage)
        console.log("this is gwei: " + this.mygasPrice)
 
        this.addresses = { // smart contracts have functions that acts in a certain way. Just like small programs they can operate to do different stuff.
            WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // base currency for binance snart chain - wbnb -
            factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // pancakeswap "factory" smart contract that lets people create a liquidity pool
            router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', //  pancakeswap "router" smart contract that lets people edit a liquidity pool
            recipient: this.useraddress.value // public address of user
          };
      
          this.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
          this.wallet = new ethers.Wallet(this.privatekey.value);
          this.account = this.wallet.connect(this.provider);
    
          
          this.factory = new ethers.Contract(
            this.addresses.factory,
            ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
            this.account
            );
            
          this.router = new ethers.Contract(
            this.addresses.router,
            [
                'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
                'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
                'function swapExactTokensForETHSupportingFeeOnTransferTokens( uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline ) external'
            ],
            this.account
            );
      
          this.wbnb = new ethers.Contract(
            this.addresses.WBNB,
            [
                'function approve(address spender, uint amount) public returns(bool)',
            ],
            this.account
            );
        };

        async detectnewcoins() {

          if (this.checkbox.checked == true) {
    
            const wbnb = new ethers.Contract(
              this.addresses.WBNB,
              [
                'function approve(address spender, uint amount) public returns(bool)',
              ],
              this.account
            );
          
            const amountIn = ethers.utils.parseUnits(this.price.value, 'ether');
          
              try {
          
                const tx = await wbnb.approve(
                  this.router.address, 
                  amountIn
                );
      
                var receipt = await tx.wait(); 
      
                console.log('Transaction receipt: ' + receipt);
          
              } catch {
                console.log("Cannot approve token... Please check bnb value!!")
              }
            
              this.checkbox.checked = false;
          }

          this.label.textContent = this.label.textContent + "\n" + "Searching pancakeswap for target token";
        
          let tokenIn = this.addresses.WBNB;
          let tokenOut = this.target.value;

          try {
            const amountIn = ethers.utils.parseUnits(this.price.value, 'ether');
      
            const amounts = await this.router.getAmountsOut(amountIn, [tokenIn, tokenOut]);

            console.log("This is amount" + amounts)
      
            this.label.textContent = this.label.textContent + "\n" + "Target token found on pancakeswap... Trying to buy new token";
      
            try {
              //We buy for 0.1 BNB of the new token
              //ethers was originally created for Ethereum, both also work for BSC
              //'ether' === 'bnb' on BSC
              const amountIn = ethers.utils.parseUnits(this.price.value, 'ether');

              console.log("this is price::::" + this.price.value)
  
              console.log("This is the amount in:" + amountIn);
      
              const amounts = await this.router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
  
              console.log("This is the amount out: " + amounts);
      
              this.label.textContent = this.label.textContent + "\n" + "This is the amount of token:" + amounts;
              //Our execution price will be a bit different, we need some flexbility
              const amountOutMin = amounts[1].sub(amounts[1].div(this.myslippage));
  
              console.log("This is the minimum amount after tolerance" + amountOutMin);
        
              this.label.textContent = this.label.textContent + "\n" + `
              Buying new token \n
              ================= \n
              tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB) \n
              tokenOut: ${amountOutMin.toString()} ${tokenOut}
              `
              
              const tx = await this.router.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                [tokenIn, tokenOut],
                this.addresses.recipient,
                Math.floor(Date.now() / 1000) + 60 * 10, 
                {
                  gasPrice: ethers.utils.parseUnits(this.mygasPrice, 'gwei'),
                  gasLimit: this.mygaslimit
                }
              );
      
              const receipt = await tx.wait(); 
      
              this.label.textContent = this.label.textContent + "\n" + `Trade accepted: Receipt: ${receipt}`;

              this.approvetargetoken(tokenIn, tokenOut, this.privatekey.value, this.addresses.recipient, this.account, this.mygaslimit, this.mygasPrice, this.myslippage, this.price.value);

            } catch(e) {
      
              this.label.textContent = "";
      
              console.log("Cannot buy token... Please check funds or approve wbnb token....");

              console.log(e);

            }
      
          } catch {
            console.log("Error not defined");

            this.label.textContent = "";

            this.detectnewcoins();
          }

        }
  


  async approvetargetoken(tokenin, tokenout, privatekey, publickey, account, gaslimit, gasprice, slippage, price) {

    const label = document.getElementById('labelid');

    try {

      const abi = [
        "function balanceOf(address owner) view returns (uint256)"
      ];

      const contract = new ethers.Contract(tokenout, abi, account);

      const balance = await contract.balanceOf(publickey);

      const targetapp = new ethers.Contract(
        tokenout,
        [
          'function approve(address spender, uint amount) public returns(bool)',
        ],
        account
      );

      const tx = await targetapp.approve(
        '0x10ED43C718714eb63d5aA57B78B54704E256024E', 
        balance
        );

      var receipt = await tx.wait();  
  
      console.log('Target token approved: Transaction receipt: ' + receipt);

      this.executefunctioninterval(tokenin, tokenout, privatekey, publickey, account, gaslimit, gasprice, slippage, price);

    } catch {
      console.log("Cannot approve target token on pancakeswap.... ")

      label.textContent = label.textContent + "Cannot approve target token on pancakeswap" + "\n";
      return;
    }

  }

  async executefunctioninterval(tokenin, tokenout, privatekey, publickey, someaccount, usergas, usergwei, slippage, price) {

    var keepGoing = true;

    var interval_id = setInterval(async function () {

      const profitpercent = document.getElementById('profitinput');

      const abi = [
        "function balanceOf(address owner) view returns (uint256)"
      ];

      console.log("this is account: " + someaccount)

      console.log("this is publickey" + publickey)

      const label = document.getElementById('labelid');

      const contract = new ethers.Contract(tokenout, abi, someaccount);

      const balance = await contract.balanceOf(publickey);

      console.log("This is the balance we bought for: " + balance)
      
      var profit = parseInt(profitpercent.value);

      var addresses = { // smart contracts have functions that acts in a certain way. Just like small programs they can operate to do different stuff.
        WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // base currency for binance snart chain - wbnb -
        factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // pancakeswap "factory" smart contract that lets people create a liquidity pool
        router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', //  pancakeswap "router" smart contract that lets people edit a liquidity pool
        recipient: publickey // public address of user
      };

      var provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      var wallet = new ethers.Wallet(privatekey);
      var account = wallet.connect(provider);

      var router = new ethers.Contract(
        addresses.router,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactTokensForETHSupportingFeeOnTransferTokens( uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline ) external'
        ],
        account
        );

    if(keepGoing){

      const label = document.getElementById('labelid');
      
      const amounts = await router.getAmountsOut(balance, [tokenout, tokenin]);
    
      const parsed = ethers.utils.formatEther(amounts[1]);

      const pricenow = parseFloat(parsed.toString());

      var percentage = ((pricenow - parseFloat(price)) / parseFloat(price)) * 100;

      label.textContent = label.textContent + "Checking coin price change" + "\n";
      
      label.style.color = "blue";
      label.textContent = label.textContent + "This is current token price =  " + pricenow + "\n";
      label.textContent = label.textContent + "This is Start token price =  " + parseFloat(price) + "\n";
      label.textContent = label.textContent + "This is the change percentage =  " + percentage + "\n" + "\n" + "\n";

      if (percentage >= profit) {

        clearInterval(interval_id);
        keepGoing = false;

        try {
          label.textContent = label.textContent + "Profit percentage reached.. attempting to sell token!" + "\n";

            console.log("Profit percentage reached.. attempting to sell token!");

            let wbnb = tokenin;
            let targettoken = tokenout;

            const amounts = await router.getAmountsOut(balance, [targettoken, wbnb]);

            console.log("This is the amount out: " + amounts[1] + "OR" + amounts);
        
            const amountOutMin = amounts[1].sub(amounts[1].div(slippage));
        
            console.log("This is amount out min: " + amountOutMin)
        
            const parsed = ethers.utils.formatEther(amounts[0].toString());
        
            console.log("This is the parsed string: " + parsed.toString())
        
            console.log("selling token" + targettoken + "amount" + amounts)
        
            console.log("wbnb token" + amountOutMin.toString())
        
            const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
              balance,
              amountOutMin,
              [targettoken, wbnb],
              addresses.recipient,
              Math.floor(Date.now() / 1000) + 60 * 10, //10 minutes
              {
                gasPrice: ethers.utils.parseUnits('10', 'gwei'),
                gasLimit: 1000000
              }
            );
        
            const receipt = await tx.wait(); 

            label.textContent = this.label.textContent + "\n" + `
            Selling new token \n
            ================= \n
            tokenIn: ${amounts[1]} ${targettoken} \n
            tokenOut: ${parsed} ${wbnb}
            `
        
            console.log(`Trade accepted: Receipt: ${receipt}`);

        } catch(e) {
          label.textContent = "";

          label.textContent = "Price percent reached... but cannot sell token" + "\n";

          label.textContent = label.textContent + "Try to increase GASLIMIT.........!";

            console.log(e);
        }
      }

    } else {
        try {
          label.textContent = "";

          label.textContent = "Timer exceeded... Forcing to sell token!";
  
          clearInterval(interval_id);
          keepGoing = false;
  
          let wbnb = tokenin;
          let targettoken = tokenout
  
          const amounts = await router.getAmountsOut(balance, [targettoken, wbnb]);
  
          console.log("This is the amount out: " + amounts[1] + "OR" + amounts);
      
          const amountOutMin = amounts[1].sub(amounts[1].div(slippage));
      
          console.log("This is amount out min: " + amountOutMin)
      
          const parsed = ethers.utils.formatEther(amounts[0].toString());
      
          console.log("This is the parsed string: " + parsed.toString())
      
          console.log("selling token" + targettoken + "amount" + amounts)
      
          console.log("wbnb token" + amountOutMin.toString())
      
          const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            balance,
            amountOutMin,
            [targettoken, wbnb],
            addresses.recipient,
            Math.floor(Date.now() / 1000) + 60 * 10, //10 minutes
            {
              gasPrice: ethers.utils.parseUnits('10', 'gwei'),
              gasLimit: 1000000
            }
          );
      
          const receipt = await tx.wait(); 

          
          label.textContent = label.textContent + "\n" + `
          Selling new token \n
          ================= \n
          tokenIn: ${amounts[1]} ${targettoken} \n
          tokenOut: ${parsed} ${wbnb}
          `
      
          console.log(`Trade accepted: Receipt: ${receipt}`);

        } catch(e) {
          label.textContent = "";

          label.textContent = "Cannot sell token..... Try to sell manually!";

          console.log(e)
        }
    }

},1000); //ticking every half second

setTimeout(function () { keepGoing = false; }, 1000 * parseInt(time.value)); //run for a small bit more than 10 to 10.5 seconds + do_a_short_piece_of_work() execution time

}
}