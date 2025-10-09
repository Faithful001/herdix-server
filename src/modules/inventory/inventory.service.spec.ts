import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create inventory', () => {
    const createInventoryDto = {
      name: 'Mowing Machine',
      costPrice: 1000,
      sellingPrice: 1500,
    };
    expect(service.createInventory).resolves.toMatchObject({
      farmId: '123034',
      ...createInventoryDto,
    });
  });
});
