import Link from "next/link";
import HeroImage from "./hero-preview.webp";
import ViewerUiImage from "./viewer-ui.webp";
import {
    Code2Icon,
    DatabaseIcon,
    GlobeIcon,
    LayoutIcon,
    ServerIcon,
    Share2Icon,
    ShieldCheckIcon,
    ZapIcon
} from "lucide-react";
import StandardsImage from "./standards-preview.webp";
import SharingImage from "./sharing.webp";

const translations = {
    en: {
        hero: {
            badge: 'the open-source DICOM platform',
            description: 'A comprehensive DICOM management and viewing' +
                        'platform with a modern, extensible web-based' +
                        'architecture.',
            gettingStarted: 'Getting Started'
        },
        coreFeatures: {
            title: 'Comprehensive & Modern DICOM Solution',
            description: 'From image storage to professional viewing, Brigid' +
                        'provides a complete toolchain to handle your medical'+
                        'imaging data.',
            viewerTitle: 'Professional DICOM Viewer',
            viewerDescription1: 'Integrated with',
            viewerDescription2: 'BlueLight Viewer',
            viewerDescription3: 'to provide a smooth web-based medical image viewing experience.',
            standardsTitle: 'DICOM & DIMSE Support',
            standardsDescription: 'Supports DICOMweb (WADO-RS, QIDO-RS, STOW-RS)' +
            'and traditional DIMSE services (C-STORE, C-FIND).',
            sharingTitle: 'Sharing & Workspaces',
            sharingDescription: 'Generate permission-controlled sharing links with'+
                                 'password protection and multi-workspace isolation.',
        },
        techStack: {
            title: 'Modern Tech Stack',
            description: 'Brigid is built with a modern technology stack, making it a reference for learning web-based medical imaging architectures.',
            frontendTitle: 'Frontend',
            backendTitle: 'Backend',
        },
        useCases: {
            title: 'Is it right for me?',
            suitableForTitle: 'Suitable For',
            unsuitableForTitle: 'Unsuitable For',
            suitableForDescription1: 'Engineers learning DICOM / PACS-related technologies',
            suitableForDescription2: 'Developers interested in medical imaging architectures',
            suitableForDescription3: 'Educational use cases and technical validation',
            unsuitableForDescription1: 'Formal clinical or medical diagnosis',
            unsuitableForDescription2: 'Production environments requiring medical certifications',
        },
        cta: {
            startExploringNow: 'Start Exploring Now'
        }
    },
    'zh-TW': {
        hero: {
            badge: '開源 DICOM 平台',
            description: '全方位的開源 DICOM 醫學影像管理與檢視平台，具有現代化、可擴充的 Web 架構',
            gettingStarted: '開始入門'
        },
        coreFeatures: {
            title: '全面且現代化的 DICOM 解決方案',
            description: '從影像儲存到專業檢視，Brigid 提供了一套完整的工具鏈，協助您處理醫療影像數據',
            viewerTitle: '內建專業 DICOM Viewer',
            viewerDescription1: '整合',
            viewerDescription2: 'BlueLight Viewer',
            viewerDescription3: '提供流暢的 Web 端醫學影像檢視體驗',
            standardsTitle: '支援 DICOM 與 DIMSE',
            standardsDescription: '支援 DICOMweb (WADO-RS, QIDO-RS, STOW-RS)' +
                                  '和傳統的 DIMSE 服務 (C-STORE, C-FIND)',
            sharingTitle: '分享與工作空間',
            sharingDescription: '具備密碼保護與到期設定的分享連結，支援多工作區資源隔離',
        },
        techStack: {
            title: '現代化技術棧',
            description: 'Brigid 採用最新技術構建，確保系統的可擴展性與高性能，可作為學習醫療影像系統架構的範本',
            frontendTitle: '前端',
            backendTitle: '後端',
        },
        useCases: {
            title: '適合我嗎？',
            suitableForTitle: '適合用於...',
            unsuitableForTitle: '不適合用於...',
            suitableForDescription1: '學習 DICOM / PACS 相關技術的工程師',
            suitableForDescription2: '對醫學影像系統架構感興趣的開發者',
            suitableForDescription3: '技術驗證與學術研究用途',
            unsuitableForDescription1: '正式的臨床或醫療用途',
            unsuitableForDescription2: '需要嚴格醫療法規認證的正式生產環境',
        },
        cta: {
            startExploringNow: '立即探索'
        }
    }
} as const;


export default async function HomePage({ params }: PageProps<"/[lang]">) {
    const { lang } = await params;

    const t = translations[lang as keyof typeof translations];

    return (
        <main className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-fd-background text-fd-foreground min-h-screen transition-colors">
            <div className="relative w-full max-w-7xl overflow-hidden rounded-3xl bg-fd-card border border-fd-border shadow-2xl mb-32">
                {/* Gradient Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute -top-24 -right-24 w-[800px] h-[800px] opacity-20 blur-[100px]"
                        style={{
                            background: "radial-gradient(circle, var(--fd-primary) 0%, transparent 70%)"
                        }}
                    />
                </div>

                <div className="relative z-10 px-8 py-18 sm:px-16 sm:py-20 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-center">
                    <div className="text-left">
                        <div className="mb-6">
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-fd-primary ring-1 ring-inset ring-fd-primary/20 bg-fd-primary/10">
                                {t.hero.badge}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-fd-foreground sm:text-6xl lg:text-7xl leading-[1.1]">
                            Brigid
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-fd-muted-foreground max-w-md">
                            {t.hero.description}
                        </p>

                        <div className="mt-6 flex items-center gap-x-4">
                            <Link
                                href={`/${lang}/docs`}
                                className="rounded-full bg-fd-primary px-8 py-3 text-sm font-bold text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
                            >
                                {t.hero.gettingStarted}
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 lg:mt-0 relative">
                        <div className="relative w-full">
                            <div
                                className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-2xl transition-transform duration-500 hover:scale-[1.02] 
                                w-full h-[250px] sm:h-[300px] 
                                lg:h-[500px] lg:w-[130%] 
                                lg:translate-x-12 lg:translate-y-12"
                            >
                                <img
                                    src={HeroImage.src}
                                    alt="Brigid App Preview"
                                    className="w-full h-full object-cover object-top opacity-90 dark:opacity-80 transition-opacity"
                                />
                            </div>

                            {/* 裝飾用的裝飾線或陰影 */}
                            <div
                                className="absolute -inset-0.5 rounded-xl bg-linear-to-br from-yellow-500/20 to-transparent opacity-50 blur-sm -z-10 
                              w-full h-[250px] sm:h-[300px]
                              lg:h-[500px] lg:w-[130%]
                              lg:translate-x-12 lg:translate-y-12"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Core Features */}
            <section className="w-full max-w-7xl mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold sm:text-4xl mb-4 text-fd-foreground">
                        {t.coreFeatures.title}
                    </h2>
                    <p className="text-fd-muted-foreground max-w-2xl mx-auto text-lg">
                        {t.coreFeatures.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card: Viewer */}
                    <div className="group rounded-2xl bg-fd-card/30 border border-fd-border p-8 hover:bg-fd-card transition-all">
                        <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-6">
                            <ZapIcon className="text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-fd-foreground">
                            {t.coreFeatures.viewerTitle}
                        </h3>
                        <p className="text-fd-muted-foreground mb-6 text-sm">
                            {t.coreFeatures.viewerDescription1}{" "}
                            <Link
                                href="https://github.com/cylab-tw/bluelight"
                                target="_blank"
                                className="text-fd-primary hover:text-fd-primary/90 transition-colors"
                            >
                                {t.coreFeatures.viewerDescription2}
                            </Link>{" "}
                            {t.coreFeatures.viewerDescription3}
                        </p>
                        <img
                            src={ViewerUiImage.src}
                            alt="Viewer Preview"
                            className="rounded-lg border border-fd-border opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                    </div>

                    {/* Feature Card: Standards */}
                    <div className="group rounded-2xl bg-fd-card/30 border border-fd-border p-8 hover:bg-fd-card transition-all">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                            <DatabaseIcon className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-fd-foreground">
                            {t.coreFeatures.standardsTitle}
                        </h3>
                        <p className="text-fd-muted-foreground mb-6 text-sm">
                            {t.coreFeatures.standardsDescription}
                        </p>

                        <img
                            src={StandardsImage.src}
                            alt="Standard Support"
                            className="rounded-lg border border-fd-border opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                    </div>

                    {/* Feature 3: sharing */}
                    <div className="group rounded-2xl bg-fd-card/30 border border-fd-border p-8 hover:bg-fd-card transition-all">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6">
                            <Share2Icon className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-fd-foreground">
                            {t.coreFeatures.sharingTitle}
                        </h3>
                        <p className="text-fd-muted-foreground mb-6 text-sm">
                            {t.coreFeatures.sharingDescription}
                        </p>
                        <img
                            src={SharingImage.src}
                            alt="Sharing Feature"
                            className="rounded-lg border border-fd-border opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
            </section>

            {/* Section: Tech Stack */}
            <section className="w-full max-w-7xl py-24 border-y border-fd-border mb-32 relative overflow-hidden rounded-3xl lg:px-12">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-fd-primary rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-16">
                    <div className="lg:max-w-xl mb-12 lg:mb-0">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-fd-foreground">
                            <Code2Icon className="text-yellow-500" /> {t.techStack.title}
                        </h2>
                        <p className="text-fd-muted-foreground text-lg mb-8">
                            {t.techStack.description}
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-fd-foreground mb-3">
                                    {t.techStack.frontendTitle}
                                </h4>
                                <ul className="text-fd-muted-foreground text-sm space-y-2 font-mono">
                                    <li>Next.js (App Router)</li>
                                    <li>Shadcn UI & Tailwind</li>
                                    <li>Tanstack Query & Zustand</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-fd-foreground mb-3">
                                    {t.techStack.backendTitle}
                                </h4>
                                <ul className="text-fd-muted-foreground text-sm space-y-2 font-mono">
                                    <li>Hono (Node.js)</li>
                                    <li>SQLite/PostgreSQL & TypeORM</li>
                                    <li>Auth.js (Casdoor/OAuth2)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-1 items-center justify-center relative">
                        {/* 背景裝飾：連線虛線 */}
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ zIndex: 0 }}
                        >
                            <path
                                d="M 200 150 L 400 150"
                                stroke="var(--fd-foreground)"
                                strokeWidth="2"
                                strokeDasharray="8 8"
                                opacity="0.1"
                            />
                            <path
                                d="M 200 300 L 400 300"
                                stroke="var(--fd-foreground)"
                                strokeWidth="2"
                                strokeDasharray="8 8"
                                opacity="0.1"
                            />
                        </svg>

                        <div className="grid grid-cols-1 gap-12 relative z-10">
                            {/* 前端節點 */}
                            <div className="flex items-center gap-6 bg-fd-card/30 border border-fd-border p-6 rounded-2xl backdrop-blur-md transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="bg-yellow-500/20 p-4 rounded-xl">
                                    <LayoutIcon className="text-yellow-500 w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-fd-foreground font-bold">
                                        Client Layer
                                    </h4>
                                    <p className="text-fd-muted-foreground text-xs">
                                        Next.js & DICOM Web Viewer
                                    </p>
                                </div>
                            </div>

                            {/* API 節點 */}
                            <div className="flex items-center gap-6 bg-fd-card/30 border border-fd-border p-6 rounded-2xl backdrop-blur-md translate-x-12 transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="bg-blue-500/20 p-4 rounded-xl">
                                    <ServerIcon className="text-blue-500 w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-fd-foreground font-bold">
                                        API Gateway
                                    </h4>
                                    <p className="text-fd-muted-foreground text-xs">
                                        Hono Micro-framework
                                    </p>
                                </div>
                            </div>

                            {/* 數據節點 */}
                            <div className="flex items-center gap-6 bg-fd-card/30 border border-fd-border p-6 rounded-2xl backdrop-blur-md transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="bg-green-500/20 p-4 rounded-xl">
                                    <DatabaseIcon className="text-green-500 w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-fd-foreground font-bold">
                                        Data Store
                                    </h4>
                                    <p className="text-fd-muted-foreground text-xs">
                                        SQLite/PostgreSQL & PACS Integration
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Use Cases */}
            <section className="w-full max-w-5xl mb-32 text-center">
              <h2 className="text-3xl font-bold mb-12 text-fd-foreground">{t.useCases.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-3xl bg-fd-card/30 border border-fd-border text-left">
                        <div className="flex items-center gap-3 mb-6 text-green-500">
                            <ShieldCheckIcon className="w-6 h-6" />
                            <h3 className="text-xl font-bold">{t.useCases.suitableForTitle}</h3>
                        </div>
                        <ul className="space-y-4 text-fd-muted-foreground text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                {t.useCases.suitableForDescription1}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                {t.useCases.suitableForDescription2}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                {t.useCases.suitableForDescription3}
                            </li>
                        </ul>
                    </div>
                    <div className="p-10 rounded-3xl bg-fd-card/30 border border-fd-border text-left">
                        <div className="flex items-center gap-3 mb-6 text-red-500">
                            <GlobeIcon className="w-6 h-6" />
                            <h3 className="text-xl font-bold">{t.useCases.unsuitableForTitle}</h3>
                        </div>
                        <ul className="space-y-4 text-fd-muted-foreground text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500/80 font-bold">✕</span>
                                {t.useCases.unsuitableForDescription1}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500/80 font-bold">✕</span>
                                {t.useCases.unsuitableForDescription2}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Final CTA (Call to Action) */}
            <section className="mb-40">
                <Link
                    href={`/${lang}/docs`}
                    className="group relative inline-flex items-center gap-3 px-14 py-5 rounded-full bg-fd-primary text-fd-primary-foreground font-bold text-xl overflow-hidden transition-all hover:bg-fd-primary/90"
                >
                    {t.cta.startExploringNow}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
            </section>
        </main>
    );
}
