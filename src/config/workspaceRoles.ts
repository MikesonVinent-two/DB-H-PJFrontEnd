/**
 * 系统角色定义
 */
export const ROLES = {
  ADMIN: 'ADMIN',           // 管理员
  CURATOR: 'CURATOR',       // 数据管理员
  EXPERT: 'EXPERT',         // 专家
  ANNOTATOR: 'ANNOTATOR',   // 标注员
  REFEREE: 'REFEREE',       // 评审员
  CROWDSOURCE_USER: 'CROWDSOURCE_USER' // 众包用户
}

/**
 * 工作台类型定义
 */
export const WORKSPACE_TYPES = {
  DATA: 'data',             // 数据管理工作台
  STANDARDIZATION: 'standardization', // 标准化工作台
  PROMPT: 'prompt',         // 提示词工作台
  EVALUATION: 'evaluation', // 评测工作台
  GENERATION: 'generation', // 生成工作台
  SYSTEM: 'system'          // 系统管理工作台
}

/**
 * 工作台配置
 * @typedef {Object} WorkspaceConfig
 * @property {string} id - 工作台唯一标识符
 * @property {string} name - 工作台名称
 * @property {string} type - 工作台类型
 * @property {string} path - 路由路径
 * @property {string[]} roles - 允许访问的角色
 * @property {string} description - 工作台描述
 * @property {string} icon - 图标名称
 */

/**
 * 工作台配置列表
 * @type {WorkspaceConfig[]}
 */
export const WORKSPACES = [
  // 数据管理工作台
  {
    id: 'original-questions',
    name: '原始问题管理',
    type: WORKSPACE_TYPES.DATA,
    path: '/data/original-questions',
    roles: [ROLES.CURATOR, ROLES.ADMIN],
    description: '管理系统中的原始问题数据',
    icon: 'Document'
  },
  {
    id: 'original-answers',
    name: '原始回答管理',
    type: WORKSPACE_TYPES.DATA,
    path: '/data/original-answers',
    roles: [ROLES.CURATOR, ROLES.ADMIN],
    description: '管理系统中的原始回答数据',
    icon: 'ChatDotRound'
  },
  {
    id: 'datasets',
    name: '数据集管理',
    type: WORKSPACE_TYPES.DATA,
    path: '/data/datasets',
    roles: [ROLES.ADMIN],
    description: '管理系统中的数据集',
    icon: 'Collection'
  },

  // 标准化工作台
  {
    id: 'question-standardization',
    name: '问题标准化',
    type: WORKSPACE_TYPES.STANDARDIZATION,
    path: '/standardization/question-standardization',
    roles: [ROLES.ANNOTATOR, ROLES.EXPERT, ROLES.ADMIN],
    description: '将原始问题标准化',
    icon: 'Edit'
  },
  {
    id: 'question-history',
    name: '问题版本历史',
    type: WORKSPACE_TYPES.STANDARDIZATION,
    path: '/standardization/question-history',
    roles: [ROLES.ANNOTATOR, ROLES.EXPERT, ROLES.ADMIN],
    description: '查看和管理问题的版本历史',
    icon: 'Timer'
  },
  {
    id: 'question-batch',
    name: '问题批量处理',
    type: WORKSPACE_TYPES.STANDARDIZATION,
    path: '/standardization/question-batch',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN],
    description: '批量处理问题',
    icon: 'Files'
  },
  {
    id: 'standard-answers',
    name: '标准回答管理',
    type: WORKSPACE_TYPES.STANDARDIZATION,
    path: '/standardization/standard-answers',
    roles: [ROLES.ANNOTATOR, ROLES.EXPERT, ROLES.ADMIN],
    description: '管理标准回答',
    icon: 'ChatLineRound'
  },
  {
    id: 'answer-review',
    name: '回答评审',
    type: WORKSPACE_TYPES.STANDARDIZATION,
    path: '/standardization/answer-review',
    roles: [ROLES.ANNOTATOR, ROLES.EXPERT, ROLES.ADMIN],
    description: '评审回答',
    icon: 'Check'
  },
  {
    id: 'answer-history',
    name: '回答版本历史',
    type: WORKSPACE_TYPES.STANDARDIZATION,
    path: '/standardization/answer-history',
    roles: [ROLES.ANNOTATOR, ROLES.EXPERT, ROLES.ADMIN],
    description: '查看和管理回答的版本历史',
    icon: 'Timer'
  },

  // 提示词工作台
  {
    id: 'answer-type-prompt',
    name: '回答阶段-题型提示词',
    type: WORKSPACE_TYPES.PROMPT,
    path: '/prompt/answer-type-prompt',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN, ROLES.EXPERT],
    description: '管理回答阶段的题型提示词',
    icon: 'Document'
  },
  {
    id: 'answer-tag-prompt',
    name: '回答阶段-标签提示词',
    type: WORKSPACE_TYPES.PROMPT,
    path: '/prompt/answer-tag-prompt',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN, ROLES.EXPERT],
    description: '管理回答阶段的标签提示词',
    icon: 'PriceTag'
  },
  {
    id: 'answer-assembly-prompt',
    name: '回答阶段-组装提示词',
    type: WORKSPACE_TYPES.PROMPT,
    path: '/prompt/answer-assembly-prompt',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN, ROLES.EXPERT],
    description: '管理回答阶段的组装提示词',
    icon: 'Connection'
  },
  {
    id: 'evaluation-subjective-prompt',
    name: '评测阶段-简答题提示词',
    type: WORKSPACE_TYPES.PROMPT,
    path: '/prompt/evaluation-subjective-prompt',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN, ROLES.EXPERT],
    description: '管理评测阶段的简答题提示词',
    icon: 'EditPen'
  },
  {
    id: 'evaluation-tag-prompt',
    name: '评测阶段-标签提示词',
    type: WORKSPACE_TYPES.PROMPT,
    path: '/prompt/evaluation-tag-prompt',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN, ROLES.EXPERT],
    description: '管理评测阶段的标签提示词',
    icon: 'PriceTag'
  },
  {
    id: 'evaluation-assembly-prompt',
    name: '评测阶段-组装提示词',
    type: WORKSPACE_TYPES.PROMPT,
    path: '/prompt/evaluation-assembly-prompt',
    roles: [ROLES.ANNOTATOR, ROLES.ADMIN, ROLES.EXPERT],
    description: '管理评测阶段的组装提示词',
    icon: 'Connection'
  },

  // 评测工作台
  {
    id: 'batch-evaluation',
    name: '批次评测',
    type: WORKSPACE_TYPES.EVALUATION,
    path: '/evaluation/batch-evaluation',
    roles: [ROLES.ADMIN],
    description: '批量评测回答',
    requiresEvaluator: true,
    icon: 'DataAnalysis'
  },
  {
    id: 'evaluations',
    name: '评测管理',
    type: WORKSPACE_TYPES.EVALUATION,
    path: '/evaluation/evaluations',
    roles: [ROLES.ADMIN],
    description: '管理评测结果',
    icon: 'Management'
  },
  {
    id: 'scoring',
    name: '评分管理',
    type: WORKSPACE_TYPES.EVALUATION,
    path: '/evaluation/scoring',
    roles: [ROLES.ADMIN],
    description: '管理评分结果',
    icon: 'StarFilled'
  },

  // 生成工作台
  {
    id: 'answer-generation',
    name: '回答生成',
    type: WORKSPACE_TYPES.GENERATION,
    path: '/generation/answer-generation',
    roles: [ROLES.ADMIN, ROLES.ANNOTATOR],
    description: '生成回答',
    icon: 'Magic'
  },
  {
    id: 'generation-batches',
    name: '生成批次管理',
    type: WORKSPACE_TYPES.GENERATION,
    path: '/generation/batches',
    roles: [ROLES.ADMIN],
    description: '管理生成批次',
    icon: 'List'
  },

  // 系统管理工作台
  {
    id: 'user-management',
    name: '用户管理',
    type: WORKSPACE_TYPES.SYSTEM,
    path: '/system/users',
    roles: [ROLES.ADMIN],
    description: '管理系统用户',
    icon: 'User'
  },
  {
    id: 'role-management',
    name: '角色管理',
    type: WORKSPACE_TYPES.SYSTEM,
    path: '/system/roles',
    roles: [ROLES.ADMIN],
    description: '管理系统角色',
    icon: 'UserFilled'
  },
  {
    id: 'model-management',
    name: '模型管理',
    type: WORKSPACE_TYPES.SYSTEM,
    path: '/system/models',
    roles: [ROLES.ADMIN],
    description: '管理AI模型',
    icon: 'CPU'
  }
]

/**
 * 按工作台类型分组的工作台配置
 * @type {Object.<string, WorkspaceConfig[]>}
 */
export const WORKSPACES_BY_TYPE = WORKSPACES.reduce((acc, workspace) => {
  if (!acc[workspace.type]) {
    acc[workspace.type] = []
  }
  acc[workspace.type].push(workspace)
  return acc
}, {} as Record<string, typeof WORKSPACES>)

/**
 * 按角色分组的工作台配置
 * @type {Object.<string, WorkspaceConfig[]>}
 */
export const WORKSPACES_BY_ROLE = WORKSPACES.reduce((acc, workspace) => {
  workspace.roles.forEach(role => {
    if (!acc[role]) {
      acc[role] = []
    }
    acc[role].push(workspace)
  })
  return acc
}, {} as Record<string, typeof WORKSPACES>)

/**
 * 检查用户是否有权限访问工作台
 * @param {string} workspaceId - 工作台ID
 * @param {string} userRole - 用户角色
 * @param {boolean} isEvaluator - 用户是否为评测员
 * @returns {boolean} - 是否有权限访问
 */
export const canAccessWorkspace = (workspaceId: string, userRole: string, isEvaluator = false): boolean => {
  const workspace = WORKSPACES.find(w => w.id === workspaceId)
  if (!workspace) return false

  const hasRole = workspace.roles.includes(userRole)
  const meetsEvaluatorRequirement = workspace.requiresEvaluator ? isEvaluator : true

  return hasRole && meetsEvaluatorRequirement
}

/**
 * 获取用户可访问的所有工作台
 * @param {string} userRole - 用户角色
 * @param {boolean} isEvaluator - 用户是否为评测员
 * @returns {WorkspaceConfig[]} - 可访问的工作台列表
 */
export const getAccessibleWorkspaces = (userRole: string, isEvaluator = false): typeof WORKSPACES => {
  return WORKSPACES.filter(workspace => {
    const hasRole = workspace.roles.includes(userRole)
    const meetsEvaluatorRequirement = workspace.requiresEvaluator ? isEvaluator : true
    return hasRole && meetsEvaluatorRequirement
  })
}

export default {
  ROLES,
  WORKSPACE_TYPES,
  WORKSPACES,
  WORKSPACES_BY_TYPE,
  WORKSPACES_BY_ROLE,
  canAccessWorkspace,
  getAccessibleWorkspaces
}
