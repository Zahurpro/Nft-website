import React,{useState} from 'react'
import {ethers} from 'ethers'
import './Button.css'
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom'



const Button = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [connEth, setConnEth] = useState(false);
  const ethToWei = 1000000000000000000;

  // Number(props.price) 
  const connectBuyHandler = async () => {
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let value = 0.08 * ethToWei;

    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
          value: `0x${value.toString(16)}`,
        },
      ],
    }).then((txHash) => console.log(txHash))
      .catch(error => setErrorMessage(error.message));

  }


  const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
        setConnButtonText('Mint Meta Lizards');
        setConnEth(true);
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
      swal({
        icon: 'error',
        title: 'Oops...',
        text: 'Metamask is not install!!!!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
		
	};

  return (
    <div className='button-container'>
        <div className='button'>
            <button className='btn button-1'>MINT 1</button>
            <button className='btn button-2'>MINT 2</button>
        </div>

        <button className='btn button-3' onClick={connEth ? connectBuyHandler : connectWalletHandler}>{connButtonText}</button>
        {errorMessage}
    </div>
  )
}

export default Button
