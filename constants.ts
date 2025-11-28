import zangshifuData from './prompts/zangshifu.json';
import picoTrexData from './prompts/PicoTrex.json';
import jimmyCases from './prompts/Jimmy.js';
import youmindData from './prompts/youmind.json';
import { PromptItem } from './types';

const SOURCE_GLIDEA = {
  name: 'glidea/banana-prompt-quicker',
  url: 'https://github.com/glidea/banana-prompt-quicker',
};

const SOURCE_JIMMYLV = {
  name: 'JimmyLv/awesome-nano-banana',
  url: 'https://github.com/JimmyLv/awesome-nano-banana',
};

const SOURCE_PICOTREX = {
  name: 'PicoTrex/Awesome-Nano-Banana-images',
  url: 'https://github.com/PicoTrex/Awesome-Nano-Banana-images',
};

const SOURCE_YOUMIND = {
  name: 'YouMind-OpenLab/awesome-gemini-3-prompts',
  url: 'https://github.com/YouMind-OpenLab/awesome-gemini-3-prompts',
};

type ZangshifuItem = {
  title: string;
  preview: string;
  prompt: string;
  author?: string;
  link?: string;
  mode?: string;
  category?: string;
  sub_category?: string;
};

type JimmyItem = {
  id: number;
  title: string;
  prompt: string;
  imageUrl: string;
  category?: string;
};

type PicoTrexItem = {
  id: number;
  title: string;
  prompt: string;
  imageUrl: string;
  category?: string;
};

type YoumindItem = {
  id: number;
  title: string;
  prompt: string;
  imageUrl: string;
  category?: string;
};

const cleanUrl = (url: string): string => {
  const parts = url.split('|')[0].split('<')[0].split('"')[0];
  return parts.trim();
};

const classifyPicoCategory = (title: string): string => {
  const lower = title.toLowerCase();
  const has = (keywords: string[]) => keywords.some((k) => lower.includes(k.toLowerCase()));

  if (has(['地图', '坐标', '街景', '地面视角', '地理', '导航', '路径', '路线', 'poi', '经纬'])) {
    return '地图/AR';
  }
  if (has(['玩具', '手办', '模型', '盲盒', '摆件', '乐高', '积木', '公仔', '雕像', '充气'])) {
    return '玩具/模型';
  }
  if (has(['人物', '角色', '面部', '肖像', '自拍', '年龄', '脸'])) {
    return '角色/肖像';
  }
  if (has(['房间', '室内', '建筑', '街区', '城市', '夜景', '公园', '等距', '街道', '园林'])) {
    return '建筑/场景';
  }
  if (has(['海报', '封面', 'logo', '包装', '广告', '信息图', '闪卡', '报纸', '贴纸', '小报', '设定集', '漫画', '插画', '卡片'])) {
    return '视觉设计';
  }
  if (has(['材质', '贴图', '纹理'])) {
    return '材质/纹理';
  }
  if (has(['流程图', 'ppt', '文档', '教程', '说明', '关系图', '报告', '提纲'])) {
    return '流程/文档';
  }

  return '创意生成';
};

const normalizeZangshifu = (item: ZangshifuItem): PromptItem => ({
  title: item.title,
  preview: item.preview,
  prompt: item.prompt,
  author: item.author || 'Unknown',
  link: item.link,
  mode: item.mode || 'generate',
  category: item.category || '其他',
  sub_category: item.sub_category,
  source: SOURCE_GLIDEA,
});

const normalizeJimmy = (item: JimmyItem): PromptItem => ({
  title: item.title,
  preview: item.imageUrl,
  prompt: item.prompt,
  author: 'JimmyLv 社区',
  link: '',
  mode: 'generate',
  category: item.category || '其他',
  source: SOURCE_JIMMYLV,
});

const normalizePicoTrex = (item: PicoTrexItem): PromptItem => ({
  title: item.title,
  preview: cleanUrl(item.imageUrl),
  prompt: item.prompt,
  author: 'PicoTrex 社区',
  link: '',
  mode: 'generate',
  category: classifyPicoCategory(item.title),
  source: SOURCE_PICOTREX,
});

const normalizeYoumind = (item: YoumindItem): PromptItem => ({
  title: item.title,
  preview: cleanUrl(item.imageUrl),
  prompt: item.prompt,
  author: 'YouMind 社区',
  link: '',
  mode: 'generate',
  category: classifyPicoCategory(item.title),
  source: SOURCE_YOUMIND,
});

const mergeAndDedupe = (...groups: PromptItem[][]): PromptItem[] => {
  const seen = new Set<string>();
  const result: PromptItem[] = [];

  groups.flat().forEach((item) => {
    const key = `${item.title}::${item.source?.name || ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(item);
  });

  return result;
};

export const PROMPTS: PromptItem[] = mergeAndDedupe(
  (zangshifuData as ZangshifuItem[]).map(normalizeZangshifu),
  (jimmyCases as JimmyItem[]).map(normalizeJimmy),
  (picoTrexData as PicoTrexItem[]).map(normalizePicoTrex),
  (youmindData as YoumindItem[]).map(normalizeYoumind),
);
