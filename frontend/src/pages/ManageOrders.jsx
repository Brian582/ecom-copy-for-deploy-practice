import { useState, useEffect, useRef, useContext } from 'react';
import '../styles/ManageOrders.css';
import axios from 'axios';
import { AuthContext } from '../Context';

export default function ManageOrders() {
  const [orders, setOrders] = useState(null);
  const [draggedOrder, setDraggedOrder] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const { auth }  = useContext(AuthContext);
  const host = useRef(import.meta.env.VITE_HOST);

  //check if user is logged in and if they are, then get their orders. Otherwise, maybe make orders into an empty list to add cart items to it.
  useEffect( () => {
      const fetchOrders = async () => {
        try {
          if (auth.status == true) {
          const response = await axios.get(`${host.current}/getUserOrders/<userID>`);
          response.data.length > 0 ? setOrders(response.data) : setOrders([])
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }

    fetchOrders();
    
  }, [auth])

  const toggleItem = (orderId, itemIndex) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item, idx) =>
                idx === itemIndex ? { ...item, checked: !item.checked } : item
              ),
            }
          : order
      )
    );
  };

  const handleDragStart = (e, order) => {
    setDraggedOrder(order);
    setDraggedFrom(order.status);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedOrder(null);
    setDraggedFrom(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // when dragging over empty column area, place at end
    const count = orders.filter((o) => o.status === column).length;
    setDragOverColumn(column);
    setDragOverIndex(count);
  };

  const handleCardDragOver = (e, column, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedOrder || draggedFrom === targetColumn) {
      setDragOverColumn(null);
      setDragOverIndex(null);
      return;
    }

    const insertPosition = dragOverIndex ?? orders.filter((o) => o.status === targetColumn).length;

    setOrders((prev) => {
      const without = prev.filter((o) => o.id !== draggedOrder.id);

      let count = 0;
      let insertAt = without.length;
      for (let i = 0; i < without.length; i++) {
        if (without[i].status === targetColumn) {
          if (count === insertPosition) {
            insertAt = i;
            break;
          }
          count++;
        }
      }

      const newOrder = { ...draggedOrder, status: targetColumn };
      without.splice(insertAt, 0, newOrder);
      return without;
    });

    setDraggedOrder(null);
    setDraggedFrom(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const renderOrderCard = (order, column, index) => (
    <div
      key={order.id}
      className={`order-card ${draggedOrder?.id === order.id ? 'dragging' : ''}`}
      draggable='true'
      onDragStart={(e) => handleDragStart(e, order)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => handleCardDragOver(e, column, index)}
    >
      <h3 className="order-title">Order #{order.id}</h3>
      <ul className="order-items">
        {order.items.map((item, idx) => (
          <li key={idx} className="order-item">
            <label className="item-label">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(order.id, idx)}
                className="item-checkbox"
              />
              <span className="item-name">{item.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );

  const columns = [
    { key: 'newOrder', title: 'New Order' },
    { key: 'processing', title: 'Processing' },
    { key: 'done', title: 'Done' },
  ];

  return (
    <div className="ordering-page">
      <main className="ordering-main">
        <div className="container">
          <h1 className="ordering-heading">Order Management</h1>
          <div className="kanban-board">
            {columns.map((col) => {
              const columnOrders = orders.filter((o) => o.status === col.key);
              return (
                <div
                  key={col.key}
                  className={`kanban-column ${dragOverColumn === col.key ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                >
                  <h2 className="column-title">{col.title}</h2>
                  <div className="column-content">
                    {columnOrders.map((order, idx) => renderOrderCard(order, col.key, idx))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
