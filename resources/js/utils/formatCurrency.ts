export const formatCurrency = (amount: string | number): string => {
  const number = parseFloat(amount.toString());
  if (isNaN(number)) return '₱0.00';
  
  return '₱' + number.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};