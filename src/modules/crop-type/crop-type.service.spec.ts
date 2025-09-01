import { Test, TestingModule } from '@nestjs/testing';
import { CropTypeService } from './crop-type.service';

describe('CropTypeService', () => {
  let service: CropTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropTypeService],
    }).compile();

    service = module.get<CropTypeService>(CropTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
