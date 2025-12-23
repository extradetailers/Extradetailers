import React, { useState } from 'react';
import { IBooking, TModuleStyle } from '@/types';

interface IItemListProps{
    cartItems: IBooking[];
    styles: TModuleStyle;
}

function ItemList({cartItems, styles}: IItemListProps) {

  return (
   

<div className={`card border-0 shadow-sm ${styles.glassEffect}`}>
<ul className="list-group list-group-flush">
  {cartItems.map((item, index) => (
    <li key={index} className="list-group-item d-flex justify-content-between align-items-start py-4">
      <div>
        <h6 className="my-1">{item.service_details?.title}</h6>
        <small className="text-muted">{item.service_details?.description}</small>
      </div>
      <span className="text-muted">Need to change dynamically</span>
    </li>
  ))}
</ul>
</div>
  )
}

export default ItemList;
