import { z } from 'zod'

// 联系人导入验证规则
export const contactImportSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符').max(50, '姓名最多50个字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
  email: z.string().email('请输入有效的邮箱').optional(),
  tags: z.array(z.string()).optional(),
  note: z.string().max(500, '备注最多500个字符').optional()
})

// 导入选项验证规则
export const importOptionsSchema = z.object({
  groupId: z.number().optional(),
  tags: z.array(z.string()).optional(),
  skipDuplicates: z.boolean().optional(),
  updateExisting: z.boolean().optional()
})

// 导出选项验证规则
export const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'xlsx']),
  scope: z.enum(['all', 'group', 'filtered', 'selected']),
  groupId: z.number().optional(),
  includeFields: z.array(z.string()).min(1, '至少选择一个导出字段'),
  dateRange: z.tuple([z.string(), z.string()]).optional()
})