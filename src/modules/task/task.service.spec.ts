import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { Task, TaskDocument } from './schemas/task.schema';
import { TaskStatus } from './enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskPriority } from './enums/task-priority.enum';
import { Document, Types } from 'mongoose';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: TaskRepository;

  const mockTask = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Test Task',
    description: 'Test Description',
    farmId: new Types.ObjectId('507f1f77bcf86cd799439012'),
    assignedTo: [new Types.ObjectId('507f1f77bcf86cd799439013')],
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    createdBy: new Types.ObjectId('507f1f77bcf86cd799439014'),
    startDate: new Date(),
    dueDate: new Date(),
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequest = {
    user: {
      _id: '507f1f77bcf86cd799439014',
      farmId: '507f1f77bcf86cd799439012',
    },
  };

  const mockTaskRepository = {
    createTask: jest.fn(),
    findAllTasks: jest.fn(),
    findTaskById: jest.fn(),
    updateTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Task Description',
        assignedTo: ['507f1f77bcf86cd799439013'],
        priority: TaskPriority.HIGH,
        startDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        farmId: '507f1f77bcf86cd799439012',
      };

      mockTaskRepository.createTask.mockResolvedValue(mockTask);

      const result = await service.create(mockRequest as any, createTaskDto);

      expect(mockTaskRepository.createTask).toHaveBeenCalledWith({
        ...createTaskDto,
        createdBy: mockRequest.user._id,
        farmId: mockRequest.user.farmId,
      });
      expect(result).toEqual({
        message: 'Task created successfully',
        data: mockTask,
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a farm', async () => {
      mockTaskRepository.findAllTasks.mockResolvedValue([mockTask] as any);

      const result = await service.findAll(mockRequest as any);

      expect(mockTaskRepository.findAllTasks).toHaveBeenCalledWith(
        mockRequest.user.farmId,
      );
      expect(result).toEqual({
        message: 'Tasks fetched successfully',
        data: [mockTask],
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskId = '507f1f77bcf86cd799439011';
      mockTaskRepository.findTaskById.mockResolvedValue(mockTask as any);

      const result = await service.findOne(mockRequest as any, taskId);

      expect(mockTaskRepository.findTaskById).toHaveBeenCalledWith(
        mockRequest.user.farmId,
        taskId,
      );
      expect(result).toEqual({
        message: 'Task fetched successfully',
        data: mockTask,
      });
    });
  });
});
