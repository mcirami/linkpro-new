import React from 'react';

const StoreProducts = ({
                           dataRow,
                           row,
                           clickType,
                           storeProducts
}) => {

    return (
        <>
            {storeProducts &&
                <div className={`my_row form ${dataRow == row && clickType === "shopify" ?
                    "open" :
                    ""}`}>
                    {dataRow == row &&
                        <div className="form_wrap">
                            <div className="products_grid folder">
                                {storeProducts.map((product) => {

                                    const {id, title, product_url, image_url, price} = product;

                                    return (
                                        <div className="single_product" key={id}>
                                            <a href={product_url} target="_blank">
                                                <div className="image_wrap">
                                                    <img src={image_url} alt={title}/>
                                                </div>
                                                <h3>{title}</h3>
                                                <p><sup>$</sup>{price}</p>
                                            </a>
                                        </div>
                                   )
                                })}
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    );
};

export default StoreProducts;
