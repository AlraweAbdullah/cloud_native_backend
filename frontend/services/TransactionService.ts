const addTransaction = async (quantity: number, customerId: number, productId: number) => {
    const data = {
        quantity,
        customerId,
        productId,
    };

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
};

const getSales = async (customerId: number) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${customerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
};

const TransactionService = {
    addTransaction,
    getSales,
};
export default TransactionService;
