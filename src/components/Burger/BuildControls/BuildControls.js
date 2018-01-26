import React from 'react';
import BuildControl from './BuildControl/BuildControl';
import classes from './BuildControls.css';

const buildControls = (props) => {

    const ingredients = [{ key: 'salad', label: 'Salad' }, { key: 'bacon', label: 'Bacon' }, { key: 'cheese', label: 'Cheese' }, { key: 'meat', label: 'Meat' }];

    const transformedItems = ingredients
        .map(item =>
            <BuildControl key={item.key}
                label={item.label}
                added={() => props.ingredientAdded(item.key)}
                removed={() => props.ingredientRemoved(item.key)}
                disabled={props.disabled[item.key]} />
        );

    return (

        <div className={classes.BuildControls}>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            {transformedItems}
            <button className={classes.OrderButton} disabled={!props.purchasable} onClick={props.ordered}>ORDER NOW</button>
        </div>
    );
}


export default buildControls;