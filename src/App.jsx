import { useEffect, useState } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import Footer from "./components/Footer";
import { db } from "./data/db";

function App() {

  const [ data ] = useState(db);
  const [ cart, setCart ] = useState(() => {
    return JSON.parse( localStorage.getItem('cart')) || [];
  });

  const MAX_ITEMS = 5;

  useEffect( () => {
    const updateLocalStorage = () => {
      localStorage.setItem('cart', JSON.stringify( cart ) )
    }
    updateLocalStorage();
  }, [cart])

  // function addToCart( item ) {
  //   if( cart.some( cartItem => cartItem.id === item.id ) ) {
  //     const newCart = cart.map( cartItem => {
  //       if ( cartItem.id === item.id ) {
  //         const newAmount = cartItem.amount + 1;
  //         return cartItem = {
  //           ...cartItem, amount: newAmount
  //         };
  //       }
  //       return cartItem;
  //     }) 
  //     setCart( newCart )
  //   } else {
  //     item.amount = 1;
  //     setCart( prevCart => [ ...prevCart, item ] )
  //   }
  // }

  function addToCart( item ) {
    const itemExists = cart.findIndex( guitar => guitar.id === item.id );
    if ( itemExists >= 0 ) {
      if (cart[itemExists].amount >= MAX_ITEMS) return;

      const newCart = [ ...cart ];
      newCart[itemExists] = {
        ...newCart[itemExists],
        amount: newCart[itemExists].amount + 1 
      }
      setCart(newCart)
    } else {
      setCart(prevCart => [...prevCart, { ...item, amount: 1 }] )
    }
  }

  function removeFromCart( id ) {
    const newCart = cart.filter( guitar => guitar.id !== id )
    setCart(newCart);
  }

  function increaseAmount( id ) {
    const newCart = cart.map( item => {
      if ( item.id === id && item.amount < MAX_ITEMS ) {
        return {
          ...item,
          amount: item.amount + 1
        }
      }
      return item;
    })
    setCart(newCart);
  }

  function decreaseAmount( id ) {
    // const newCart = cart.map( item => {
    //   if( item.id === id )
    //     return {
    //       ...item,
    //       amount: item.amount - 1
    //   };

    //   return item;
    // })
    // const cartFilter = newCart.filter( guitar => guitar.amount !== 0)
    // setCart(cartFilter);
    const newCart = cart.reduce( (cartAcc, item) => {
      if( item.id === id ) {
        const newAmount = item.amount - 1;
        if ( newAmount > 0 ) {
          cartAcc.push( { ...item, amount: newAmount } )
        }
      } else {
        cartAcc.push( item );
      }
      return cartAcc;
    }, [])

    setCart(newCart);
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <>
    <Header 
      cart={cart}
      removeFromCart={removeFromCart}
      increaseAmount={increaseAmount}
      decreaseAmount={decreaseAmount}
      clearCart={clearCart}
    />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">

          { data.map( guitar => (
            <Guitar guitar={guitar} key={guitar.id} addToCart={addToCart} />
          )
          )}    

        </div>
      </main>

    <Footer />
    </>
  )
}

export default App