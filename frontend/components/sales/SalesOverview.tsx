import React from 'react';
import { Sale } from '../../types';

type Props = {
    sales: Array<Sale>;
};

const SalesOverview: React.FC<Props> = ({ sales }: Props) => {
    return (
        <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
                <tr>
                    <th className="text-white">Product</th>
                    <th className="text-white">Quantity</th>
                    <th className="text-white">Date</th>
                    <th className="text-white">Buyer</th>
                </tr>
            </thead>
            <tbody>
                {sales &&
                    sales.map((sale, index) => (
                        <tr key={index}>
                            <td>{sale.productSerialNumber}</td>
                            <td>{sale.quantity}</td>
                            <td>{new Date(sale.date).toLocaleString()}</td>
                            <td>{sale.buyerUsername}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default SalesOverview;
