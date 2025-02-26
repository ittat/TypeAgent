import { Module } from '@nestjs/common';
import { ProductManager } from './product-manager.role';
import { ProjectManager } from './project-manager.role';
import { Architect } from './architect.role';
import { Engineer } from './engineer.role';
import { MemoryModule } from 'src/memory/memory.module';
import { ActionsModule } from 'src/actions/actions.module';
import { SystemModule } from 'src/system/system.module';

@Module({
    imports:[MemoryModule,ActionsModule,SystemModule],
  providers: [ProductManager, ProjectManager, Architect, Engineer],
  exports: [ProductManager, ProjectManager, Architect, Engineer],
})
export class RolesModule {}