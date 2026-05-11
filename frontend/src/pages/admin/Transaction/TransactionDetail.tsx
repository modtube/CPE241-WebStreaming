import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin, Tag, message, Modal } from 'antd';

interface TransactionItem {
  movie_id: string;
  movie_name: string;
  price: number;
}

interface TransactionDetailData {
  transaction_id: string;
  status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  date: string;
  time: string;
  payment_method: string;
  items: TransactionItem[];
}

export default function TransactionDetail() {
  const { id } = useParams();
  const [data, setData] = useState<TransactionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`);
      if (!response.ok) throw new Error('Fetch failed');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch transaction detail:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = () => {
    setRefundModalOpen(true);
  };

  const confirmRefund = async () => {
    setRefundLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}/refund`, {
        method: 'PUT',
      });
      const result = await response.json();
      if (response.ok) {
        message.success('Refund successful!');
        setRefundModalOpen(false);
        fetchDetail();
      } else {
        message.error(result.message || 'Refund failed.');
      }
    } catch (error) {
      message.error('Failed to process refund.');
    } finally {
      setRefundLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!data) return;

    const printContent = `
      <html>
        <head>
          <title>Receipt - ${data.transaction_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; background: #dcfce7; color: #15803d; margin-bottom: 24px; }
            .total { font-size: 32px; font-weight: bold; color: #2563eb; text-align: right; }
            .label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin: 24px 0; }
            hr { border: none; border-top: 1px solid #f3f4f6; margin: 24px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            thead th { background: #f9fafb; padding: 12px 16px; text-align: left; font-size: 11px; color: #9ca3af; text-transform: uppercase; }
            tbody td { padding: 12px 16px; border-top: 1px solid #f3f4f6; }
            tfoot td { padding: 12px 16px; font-weight: bold; border-top: 1px solid #e5e7eb; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h1>${data.transaction_id}</h1>
              <span class="status">${data.status}</span>
            </div>
            <div style="text-align:right;">
              <div class="label">Total Billed</div>
              <div class="total">$${Number(data.total_amount).toFixed(2)}</div>
            </div>
          </div>
          <hr/>
          <div class="grid">
            <div>
              <div class="label">Customer</div>
              <div style="font-weight:500;">${data.customer_name}</div>
              <div style="color:#6b7280; font-size:13px;">${data.customer_email}</div>
            </div>
            <div>
              <div class="label">Date & Time</div>
              <div style="font-weight:500;">${data.date}</div>
              <div style="color:#6b7280; font-size:13px;">${data.time}</div>
            </div>
            <div>
              <div class="label">Payment Method</div>
              <div style="font-weight:500;">${data.payment_method}</div>
            </div>
          </div>
          <hr/>
          <h2 style="font-size:15px; font-weight:bold; margin-bottom:12px;">Purchased Items</h2>
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th class="text-center">ID</th>
                <th class="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${data.items && data.items.length > 0
                ? data.items.map(item => `
                  <tr>
                    <td>${item.movie_name || '-'}</td>
                    <td class="text-center">${item.movie_id || '-'}</td>
                    <td class="text-right">$${Number(item.price).toFixed(2)}</td>
                  </tr>`).join('')
                : `<tr><td colspan="3" class="text-center" style="color:#9ca3af; padding:24px;">No items found</td></tr>`
              }
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-right">Total</td>
                <td class="text-right">$${Number(data.total_amount).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  if (!data) return <div className="text-center mt-10 text-gray-500">Data not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-2">

        {/* ส่วนหัว */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{data.transaction_id}</h1>
            <Tag
              color={data.status === 'Completed' ? 'success' : data.status === 'Pending' ? 'warning' : 'error'}
              className="rounded-full px-3 py-1 font-medium border-0"
            >
              {data.status === 'Completed' && (
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse" />
              )}
              {data.status}
            </Tag>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Billed</p>
            <p className="text-4xl font-bold text-blue-600">${Number(data.total_amount).toFixed(2)}</p>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* ข้อมูลลูกค้า และ การชำระเงิน */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Customer</p>
            <p className="text-gray-900 font-medium">{data.customer_name || '-'}</p>
            <p className="text-gray-500 text-sm">{data.customer_email || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Date & Time</p>
            <p className="text-gray-900 font-medium">{data.date || '-'}</p>
            <p className="text-gray-500 text-sm">{data.time || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Payment Method</p>
            <p className="text-gray-900 font-medium">{data.payment_method || '-'}</p>
          </div>
        </div>

        {/* ตารางสินค้า */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Purchased Items</h2>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Movie</th>
                  <th className="px-6 py-4 text-center">ID</th>
                  <th className="px-6 py-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.movie_name || '-'}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{item.movie_id || '-'}</td>
                      <td className="px-6 py-4 text-right text-gray-900">${Number(item.price).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">No items found</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-white">
                <tr>
                  <td colSpan={2} className="px-6 py-5 text-right font-bold text-gray-600">Total</td>
                  <td className="px-6 py-5 text-right font-bold text-gray-900 text-base">${Number(data.total_amount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ปุ่ม Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
          <Button
            danger
            className="h-10 px-6 font-medium rounded-lg hover:bg-red-50"
            disabled={data.status === 'Refunded' || data.status === 'Cancelled'}
            onClick={handleRefund}
          >
            Issue Refund
          </Button>
          <Button
            type="primary"
            className="h-10 px-6 font-medium rounded-lg bg-gray-900 hover:bg-gray-800 border-gray-900 shadow-md shadow-gray-900/20"
            onClick={handleDownloadReceipt}
          >
            Download Receipt
          </Button>
        </div>

      </div>

      {/* Refund Modal */}
      <Modal
        open={refundModalOpen}
        title="Confirm Refund"
        okText="Confirm Refund"
        okButtonProps={{ danger: true, loading: refundLoading }}
        cancelText="Cancel"
        onOk={confirmRefund}
        onCancel={() => setRefundModalOpen(false)}
      >
        Are you sure you want to refund transaction <strong>{id}</strong>? This action cannot be undone.
      </Modal>
    </div>
  );
}