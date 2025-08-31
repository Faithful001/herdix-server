import { Test, TestingModule } from '@nestjs/testing';
import { LivestockTypeController } from './livestock-type.controller';
import { LivestockTypeService } from './livestock-type.service';

describe('LivestockTypeController', () => {
  let controller: LivestockTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivestockTypeController],
      providers: [LivestockTypeService],
    }).compile();

    controller = module.get<LivestockTypeController>(LivestockTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
