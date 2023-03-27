import { SET_PRODUCTS } from "./actionTypes";
import axios from "axios";

// export const setProducts = (products) => {
//     const response =  axios
//     .get("https://fakestoreapi.com/products")
//     .catch((err) => {
//       console.log("Err: ", err);
//     });
//     console.log('response',response);
//     return {
//       type: SET_PRODUCTS,
//       payload: response.data,
//     };
//   };

  export const setProducts =()=>async(dispatch) => {
    const response =await  axios
    .get("https://fakestoreapi.com/products")
    .catch((err) => {
      console.log("Err: ", err);
    });
    dispatch({
       type: SET_PRODUCTS,
      payload: response.data,
    });
  
  };

