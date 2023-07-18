import { recivedMesssages } from './index';

describe('recivedMesssages interface', () => {
  it('has the correct properties', () => {
    const message: recivedMesssages = {
      content: 'Test message',
      role: 'Test role',
      _id: '123',
    };

    expect(message).toHaveProperty('content');
    expect(message).toHaveProperty('role');
    expect(message).toHaveProperty('_id');
  });
});