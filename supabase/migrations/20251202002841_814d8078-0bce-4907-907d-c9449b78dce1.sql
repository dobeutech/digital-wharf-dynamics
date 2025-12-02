-- Add missing RLS policies for user operations

-- Projects: Allow users to create projects (after purchase)
CREATE POLICY "Users can create their own projects" ON public.projects 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects: Allow users to delete their own projects
CREATE POLICY "Users can delete their own projects" ON public.projects 
FOR DELETE USING (auth.uid() = user_id);

-- Project Tasks: Allow users to create tasks for their projects
CREATE POLICY "Users can create tasks for their projects" ON public.project_tasks 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid())
);

-- Project Tasks: Allow users to delete tasks from their projects
CREATE POLICY "Users can delete tasks from their projects" ON public.project_tasks 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid())
);

-- Client Files: Allow users to upload their own files
CREATE POLICY "Users can upload their own files" ON public.client_files 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Client Files: Allow users to update their own files metadata
CREATE POLICY "Users can update their own files" ON public.client_files 
FOR UPDATE USING (auth.uid() = user_id);

-- Purchases: Allow users to update their own purchases (e.g., cancellation)
CREATE POLICY "Users can update their own purchases" ON public.purchases 
FOR UPDATE USING (auth.uid() = user_id);