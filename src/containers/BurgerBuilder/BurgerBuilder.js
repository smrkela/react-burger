import React, { Component } from 'react';

import Aux from '../../hoc/Auxx/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {

        console.log("Loading ingredients...");

        axios.get("/ingredients.json")
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({ error: true });
            });
    }

    addIngredientHandler = (type) => {

        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = this.state.ingredients[type] + 1;

        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

        this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });

        this.updatePurchasable(updatedIngredients);
    }

    removeIngredientHandler = (type) => {

        if (this.state.ingredients[type] === 0)
            return;

        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = this.state.ingredients[type] - 1;

        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

        this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });

        this.updatePurchasable(updatedIngredients);
    }

    updatePurchasable = (ingredients) => {

        const canOrder = Object.values(ingredients).reduce((prev, item) => prev || item > 0, false);

        this.setState({ purchasable: canOrder });
    }

    purchaseHandler = () => {

        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {

        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        //alert("You continue!");

        this.setState({ loading: true, purchasing: true });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "Sasa Mrkela",
                address: {
                    street: "Test Street",
                    zipCode: "123321",
                    country: "Serbia"
                },
                email: "test@test.com"
            },
            deliveryMethod: "fastest"
        };

        axios.post('/orders.json', order)
            .then(result => {
                console.log("Result: ", result);
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                console.log("Error: ", error);
                this.setState({ loading: false, purchasing: false });
            });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }

        let orderSummary = null;
        let burger = <Spinner />;

        if(this.state.error)
            burger = <p>Ingredients cannot be loaded.</p>;

        if (this.state.ingredients) {

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = (
                <OrderSummary ingredients={this.state.ingredients}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.state.totalPrice} />
            );
        }

        if (this.state.loading)
            orderSummary = <Spinner />;

        return (

            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }

}

export default withErrorHandler(BurgerBuilder, axios);