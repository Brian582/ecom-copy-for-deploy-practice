import { useState, useEffect, useRef, useContext } from 'react';
import '../styles/ManageOrders.css';
import axios from 'axios';
import { AuthContext } from '../Context.jsx';

// ManageOrders: displays a kanban board, fetches orders, allows drag/drop, and sends SMS notifications.
export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [draggedOrder, setDraggedOrder] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const { auth }  = useContext(AuthContext);
  const host = useRef(import.meta.env.VITE_HOST);
  const prevOrdersRef = useRef([]);
  const isWorker = !!(
    auth?.user && (
      auth.user.role === 'worker' || auth.user.isWorker || auth.user.worker
    )
  );
  // const columns = useRef([
  //   { key: 'new', title: 'New Order' },
  //   { key: 'processing', title: 'Processing' },
  //   { key: 'done', title: 'Done' },
  // ]);

  //Fetch orders for the logged-in user
  useEffect(() => {
    // fetchOrders: fetch and set the logged-in user's orders.
    const fetchOrders = async () => {
      try {
        if (auth?.isLoggedIn) {
          const userId = String(auth.user?.userId || auth.user?.id || '');
          if (!userId) {
            setOrders([]);
            return;
          }
          const response = await axios.get(`${host.current}/getUserOrders/${userId}`);
          setOrders(Array.isArray(response.data) ? response.data : []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [auth?.isLoggedIn, auth?.user?.userId, auth?.user?.id]);

  //notify user when their order status changes
  // useEffect(() => {
  //   const notifyUserOrderStatus = async () => {
  //     try {


  // })

  // toggleItem: toggle the checked flag for an item in an order.
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

  // handleDragStart: start dragging an order and record its origin column.
  const handleDragStart = (e, order) => {
    setDraggedOrder(order);
    setDraggedFrom(order.status);
    e.dataTransfer.effectAllowed = 'move';
  };

  // handleDragEnd: clear drag state after dragging finishes.
  const handleDragEnd = () => {
    setDraggedOrder(null);
    setDraggedFrom(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  // handleDragOver: allow dropping into a column and set insertion index at end.
  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // when dragging over empty column area, place at end
    const count = orders.filter((o) => o.status === column).length;
    setDragOverColumn(column);
    setDragOverIndex(count);
  };

  // handleCardDragOver: set insertion index when dragging over a specific card.
  const handleCardDragOver = (e, column, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
    setDragOverIndex(index);
  };

  // handleDragLeave: clear drag-over state when leaving a column area.
  const handleDragLeave = () => {
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  // handleDrop: move dragged order to target column and update orders state.
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

  // Notify via SMS when an order's status changes (column moved)
  useEffect(() => {
    const prev = prevOrdersRef.current || [];
    const prevStatusMap = new Map(prev.map((prevOrder) => [prevOrder.id, prevOrder.status]));

    const statusTitles = {
      new: 'New Order',
      processing: 'Processing',
      done: 'Done',
    };

    const moved = orders.filter((currOrder) => {
      const prevStatus = prevStatusMap.get(currOrder.id);
      return prevStatus && prevStatus !== currOrder.status;
    });

    if (moved.length > 0) {
      moved.forEach(async (order) => {
        try {
          // best-effort extraction of customer name/phone from order object
          // const customer = order.customer || order.user || order.customerName || order.customer_name || order.name || '';
          // const phone = order.customerPhoneNumber || order.customer_phone || order.phone || order.phoneNumber || order.customerPhone || '';
          // const columnTitle = statusTitles[order.status] || order.status;
          // const columnTitle = columns[order.status] || order.status;
          
          const data = {
            // user: customer,
            // columnTitle,
            // orderID: order.id,
            status: order.status,
            // customerPhoneNumber: phone,
          }

          await axios.patch(`${host.current}/updateOrders/${order.id}/status`, data);// no need to return anything

        } catch (err) {
          console.error('Error sending SMS for order', order.id, err);
        }
      });
    }

    prevOrdersRef.current = orders;// updates ref.current to refer to the new changes each order
  }, [orders]);

  // renderOrderCard: render a single order card JSX with items and checkboxes.
  const renderOrderCard = (order, column, index) => (
    <div
      key={order.id}
      className={`order-card ${draggedOrder?.id === order.id ? 'dragging' : ''}`}
      draggable={isWorker}
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
    { key: 'new', title: 'New Order' },
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
