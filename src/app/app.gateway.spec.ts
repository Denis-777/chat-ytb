import { Test, TestingModule } from '@nestjs/testing';
import { AddGateway } from './add.gateway';

describe('AddGateway', () => {
  let gateway: AddGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddGateway],
    }).compile();

    gateway = module.get<AddGateway>(AddGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
