interface CreatePaymentParams {
  currency: string;
  amount: number;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export async function createHoodPayPayment({
  apiUrl,
  businessId,
  authToken,
  redirectUrl,
  params
}: {
  apiUrl: string;
  businessId: string;
  authToken: string;
  redirectUrl: string;
  params: CreatePaymentParams;
}) {
  try {
    console.log('🚀 Creating HoodPay payment with params:', {
      url: `${apiUrl}/businesses/${businessId}/payments`,
      params,
      redirectUrl
    });

    const requestBody = {
      ...params,
      redirectUrl,
    };

    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${apiUrl}/businesses/${businessId}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 Response status:', response.status);
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);

    if (!response.ok) {
      throw new Error(`HoodPay API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('✅ HoodPay payment created:', data);
    return data.data.url;
  } catch (error) {
    console.error('❌ HoodPay payment creation failed:', {
      error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 