import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { LessonRepository } from '../repository';
import { Lesson } from '../entity';
import { LessonDTO, LessonUpdateDTO, NewLessonDTO } from '../dto';

@Injectable()
export class LessonService {

    constructor(
        private readonly repository: LessonRepository,
    ) {
    }

    public async add(lesson: NewLessonDTO): Promise<Lesson> {

        const lessonSameTitle: Lesson = await this.findByTitle( lesson.title, lesson.courseId );
        if (lessonSameTitle) {
            throw new ConflictException();
        }

        return this.repository.save(lesson);
    }

    public async update(id: Lesson['id'], lessonUpdatedInfo: LessonUpdateDTO): Promise<Lesson> {
        const lesson: Lesson = await this.findById(id);
        return this.repository.save({ ...lesson, ...lessonUpdatedInfo });
    }

    public async getAll(courseId: Lesson['courseId']): Promise<Lesson[]> {
        return this.repository.find({ courseId });
    }

    public async findById(id: Lesson['id']): Promise<Lesson> {
        const lesson: Lesson = await this.repository.findOne({ id });
        if (!lesson) {
            throw new NotFoundException();
        }
        return lesson;
    }

    public async delete(id: Lesson['id']): Promise<void> {
        await this.repository.delete({ id });
    }

    public async findByTitle(title: Lesson['title'], courseId: Lesson['courseId']): Promise<Lesson> {
        const lesson = await this.repository.findByTitleAndCourseId({ title, courseId });
        if (!lesson) {
            throw new NotFoundException();
        }
        return lesson;
    }
}
