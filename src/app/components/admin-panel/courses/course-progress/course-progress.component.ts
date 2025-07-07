import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CourseProgressService } from '../../../../services/course-progress.service';
import {CourseProgress} from '../../../../models/courseProgressModel';
import { DailymotionPlayerComponent } from '../dailymotion-player/dailymotion-player.component';

@Component({
  selector: 'app-course-progress',
  imports: [CommonModule,DailymotionPlayerComponent ],
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css']
})
export class CourseProgressComponent implements OnInit {
  courseProgressList: CourseProgress[] = [];
  courseId = 4; // You can set this dynamically as needed
  courseName="";
  courseDescription=""; 
  groupedModules: {
    moduleName: string;
    moduleDescription: string;
    videos: CourseProgress[];
  }[] = [];

  constructor(private courseProgressService: CourseProgressService) {}

  ngOnInit(): void {
    this.loadCourseProgress();
  }

  loadCourseProgress() {
    this.courseProgressService.getCourseProgress(this.courseId).subscribe({
      next: (data) => {
        this.courseProgressList = data;
        this.courseName = this.courseProgressList.length > 0 ? this.courseProgressList[0].CourseName : '';
        this.courseDescription = this.courseProgressList.length > 0 ? this.courseProgressList[0].CourseDescription : '';
        this.groupModules();
      },
      error: (err) => console.error('Error loading course progress', err)
    });
  }

  groupModules() {
    const moduleMap = new Map<number, { moduleName: string; moduleDescription: string; videos: CourseProgress[] }>();
    for (const item of this.courseProgressList) {
      if (!moduleMap.has(item.ModuleId)) {
        moduleMap.set(item.ModuleId, {
          moduleName: item.ModuleName,
          moduleDescription: item.ModuleDescription,
          videos: []
        });
      }
      moduleMap.get(item.ModuleId)!.videos.push(item);
    }
    this.groupedModules = Array.from(moduleMap.values());
  }
}
