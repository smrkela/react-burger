import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    let transformedIngredients = Object.keys(props.ingredients)
        .map(key => {
            return [...Array(props.ingredients[key])]
                .map((_, i) => {
                    return <BurgerIngredient key={key + i} type={key} />
                });
        })
        .reduce((array, item) => {
            return array.concat(item);
        }, []);

    if(transformedIngredients.length === 0)
        transformedIngredients = <div>Please start adding ingredients!</div>

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;