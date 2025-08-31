import { Test, TestingModule } from '@nestjs/testing';
import { LivestockTypeService } from './livestock-type.service';

describe('LivestockTypeService', () => {
  let service: LivestockTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivestockTypeService],
    }).compile();

    service = module.get<LivestockTypeService>(LivestockTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
