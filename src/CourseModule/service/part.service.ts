import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PartRepository } from '../repository';
import { Part } from '../entity';
import { PartDTO, PartUpdateDTO, NewPartDTO } from '../dto';

@Injectable()
export class PartService {

    constructor(
        private readonly repository: PartRepository,
    ) {
    }

    public async add(part: NewPartDTO): Promise<Part> {

        const partSameTitle: Part = await this.findByTitle( part.title, part.lessonId );
        if (partSameTitle) {
            throw new ConflictException();
        }

        return this.repository.save(part);
    }

    public async update(id: Part['id'], partUpdatedInfo: PartUpdateDTO): Promise<Part> {
        const part: Part = await this.findById(id);
        return this.repository.save({ ...part, ...partUpdatedInfo });
    }

    public async getAll(lessonId: Part['lessonId']): Promise<Part[]> {
        return this.repository.find({ lessonId });
    }

    public async findById(id: Part['id']): Promise<Part> {
        const part: Part = await this.repository.findOne(id);
        if (!part) {
            throw new NotFoundException();
        }
        return part;
    }

    public async delete(id: Part['id']): Promise<void> {
        await this.repository.delete(id);
    }

    public async findByTitle( title: Part['title'], lessonId: Part['lessonId'] ): Promise<Part> {
        const part = await this.repository.findByTitleAndLessonId({ title, lessonId });
        if (!part) {
            throw new NotFoundException();
        }
        return part;
    }
}
