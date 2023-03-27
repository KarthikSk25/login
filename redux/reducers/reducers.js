import { SET_PRODUCTS } from "../actions/actionTypes";
const intialState = {
   
  };
  
  export const productsReducer = (state = intialState,action) => {
    switch (action.type) {
      case SET_PRODUCTS:
        return {
             ...state, 
             products:action.payload
            };
            
      default:
        return state;
    }
  };