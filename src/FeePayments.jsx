import React, { useState } from 'react';
import './FeePayments.css';

function FeePayments() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [newPaymentData, setNewPaymentData] = useState({
    studentName: '',
    classVal: 'Grade 1',
    amount: '1,000',
    paid: '1,000',
    due: '0',
    status: 'Paid'
  });

  const [paymentsList, setPaymentsList] = useState([
    { id: 1, name: 'Fitsum Alemu', class: 'Grade 1', amount: '1,000', paid: '1,000', due: '0', status: 'Paid' },
    { id: 2, name: 'Selam Tesfaye', class: 'Grade 2', amount: '1,000', paid: '500', due: '500', status: 'Partial' },
    { id: 3, name: 'Abebe Kebede', class: 'Grade 3', amount: '1,000', paid: '1,000', due: '0', status: 'Paid' },
    { id: 4, name: 'Mekdes Girma', class: 'Grade 4', amount: '1,000', paid: '0', due: '1,000', status: 'Unpaid' }
  ]);

  const handleSaveNewPayment = (e) => {
    e.preventDefault();
    if (!newPaymentData.studentName) {
      alert("እባክዎ የተማሪውን ስም ያስገቡ!");
      return;
    }

    const newEntry = {
      id: paymentsList.length + 1,
      name: newPaymentData.studentName,
      class: newPaymentData.classVal,
      amount: newPaymentData.amount,
      paid: newPaymentData.paid,
      due: newPaymentData.due,
      status: newPaymentData.status
    };

    setPaymentsList([newEntry, ...paymentsList]);
    setIsAdding(false);
    setNewPaymentData({ studentName: '', classVal: 'Grade 1', amount: '1,000', paid: '1,000', due: '0', status: 'Paid' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPaymentsList(paymentsList.map(p => p.id === editingPayment.id ? editingPayment : p));
    setEditingPayment(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("ይህንን የክፍያ መረጃ እርግጠኛ ኖት መሰረዝ ይፈልጋሉ?")) {
      setPaymentsList(paymentsList.filter(p => p.id !== id));
    }
  };

  const handleView = (payment) => {
    alert(`የክፍያ ዝርዝር:\nስም: ${payment.name}\nክፍል: ${payment.class}\nአጠቃላይ: ${payment.amount}\nየተከፈለ: ${payment.paid}\nቀሪ: ${payment.due}\nስታተስ: ${payment.status}`);
  };

  return (
    <div className="fees-page" style={{ padding: '10px' }}>
      {isAdding ? (
        <div style={{ background: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Add New Payment</h3>
          <form onSubmit={handleSaveNewPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>Student Name *</label>
            <input 
              type="text" 
              placeholder="Enter student name" 
              value={newPaymentData.studentName}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, studentName: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
              required
            />

            <label style={{ fontSize: '14px', fontWeight: '600' }}>Class *</label>
            <select 
              value={newPaymentData.classVal}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, classVal: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
            </select>

            <label style={{ fontSize: '14px', fontWeight: '600' }}>Amount *</label>
            <input 
              type="text" 
              value={newPaymentData.amount}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, amount: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />

            <label style={{ fontSize: '14px', fontWeight: '600' }}>Paid *</label>
            <input 
              type="text" 
              value={newPaymentData.paid}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, paid: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />

            <label style={{ fontSize: '14px', fontWeight: '600' }}>Due *</label>
            <input 
              type="text" 
              value={newPaymentData.due}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, due: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />

            <label style={{ fontSize: '14px', fontWeight: '600' }}>Status *</label>
            <select 
              value={newPaymentData.status}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, status: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '9px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button type="submit" style={{ padding: '9px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="fees-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e293b', fontSize: '22px', margin: 0 }}>Fees & Payments</h2>
            <button 
              onClick={() => setIsAdding(true)}
              style={{ 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                padding: '10px 18px', 
                borderRadius: '6px', 
                fontWeight: '600', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + Add Payment
            </button>
          </div>

          <div className="table-container" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>No</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Student Name</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Class</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Paid</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Due</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentsList.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>{index + 1}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{item.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>{item.class}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>{item.amount}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>{item.paid}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>{item.due}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                      <span style={{ 
                        background: item.status === 'Paid' ? '#dcfce7' : item.status === 'Partial' ? '#fef3c7' : '#fee2e2', 
                        color: item.status === 'Paid' ? '#16a34a' : item.status === 'Partial' ? '#d97706' : '#dc2626', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          title="View" 
                          onClick={() => handleView(item)}
                          style={{ background: '#e0f2fe', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                        >
                          👁️
                        </button>
                        <button 
                          title="Edit" 
                          onClick={() => setEditingPayment(item)}
                          style={{ background: '#fef3c7', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                        >
                          ✏️
                        </button>
                        <button 
                          title="Delete" 
                          onClick={() => handleDelete(item.id)}
                          style={{ background: '#fee2e2', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editingPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '380px' }}>
            <h3>Edit Payment Information</h3>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              <label>Student Name:</label>
              <input 
                type="text" 
                value={editingPayment.name} 
                onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />

              <label>Class:</label>
              <input 
                type="text" 
                value={editingPayment.class} 
                onChange={(e) => setEditingPayment({ ...editingPayment, class: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />

              <label>Amount:</label>
              <input 
                type="text" 
                value={editingPayment.amount} 
                onChange={(e) => setEditingPayment({ ...editingPayment, amount: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />

              <label>Paid:</label>
              <input 
                type="text" 
                value={editingPayment.paid} 
                onChange={(e) => setEditingPayment({ ...editingPayment, paid: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />

              <label>Due:</label>
              <input 
                type="text" 
                value={editingPayment.due} 
                onChange={(e) => setEditingPayment({ ...editingPayment, due: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />

              <label>Status:</label>
              <select 
                value={editingPayment.status} 
                onChange={(e) => setEditingPayment({ ...editingPayment, status: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setEditingPayment(null)} style={{ padding: '8px 14px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeePayments;