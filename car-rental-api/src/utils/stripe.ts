export const stripeMock = {
  createPaymentIntent: async (amount: number) => ({
    id: `pi_mock_${amount}`,
    clientSecret: `pi_mock_${amount}_secret`
  })
};
