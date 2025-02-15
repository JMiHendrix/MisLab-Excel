import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula/lib/index.css';
import style from './index.module.css'

import { LocaleType, Univer, Tools } from "@univerjs/core";
import { defaultTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverUIPlugin } from '@univerjs/ui';
import DesignZhCN from '@univerjs/design/locale/zh-CN';
import UIZhCN from '@univerjs/ui/locale/zh-CN';
import DocsUIZhCN from '@univerjs/docs-ui/locale/zh-CN';
import SheetsZhCN from '@univerjs/sheets/locale/zh-CN';
import SheetsUIZhCN from '@univerjs/sheets-ui/locale/zh-CN';
import SheetsFormulaZhCN from '@univerjs/sheets-formula/locale/zh-CN';
import { forwardRef, useEffect, useImperativeHandle, useRef, memo } from 'react';

const UniverSheet = forwardRef(({ data }, ref) => {
    const univerRef = useRef(null);
    const workbookRef = useRef(null);
    const containerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getData,
    }));

    /**
     * Initialize univer instance and workbook instance
     * @param data {IWorkbookData} document see https://univer.work/api/core/interfaces/IWorkbookData.html
     */
    const init = (data = {}) => {
        if (!containerRef.current) {
            throw Error('container not initialized');
        }
        const univer = new Univer({
            theme: defaultTheme,
            locale: LocaleType.ZH_CN,
            locales: {
                [LocaleType.ZH_CN]: Tools.deepMerge(
                    SheetsZhCN,
                    DocsUIZhCN,
                    SheetsUIZhCN,
                    SheetsFormulaZhCN,
                    UIZhCN,
                    DesignZhCN,
                ),
            },
        });
        univerRef.current = univer;

        // core plugins
        univer.registerPlugin(UniverRenderEnginePlugin);
        univer.registerPlugin(UniverFormulaEnginePlugin);
        univer.registerPlugin(UniverUIPlugin, {
            container: containerRef.current,
            header: true,
            toolbar: true,
            footer: true,
        });

        // doc plugins
        univer.registerPlugin(UniverDocsPlugin, {
            hasScroll: false,
        });
        univer.registerPlugin(UniverDocsUIPlugin);

        // sheet plugins
        univer.registerPlugin(UniverSheetsPlugin);
        univer.registerPlugin(UniverSheetsUIPlugin);
        univer.registerPlugin(UniverSheetsFormulaPlugin);

        // create workbook instance
        workbookRef.current = univer.createUniverSheet(data);
    };

    /**
     * Destroy univer instance and workbook instance
     */
    const destroyUniver = () => {
        univerRef.current?.dispose();
        univerRef.current = null;
        workbookRef.current = null;
    };

    /**
     * Get workbook data
     */
    const getData = () => {
        if (!workbookRef.current) {
            throw new Error('Workbook is not initialized');
        }
        return workbookRef.current.save();
    };

    useEffect(() => {
        init(data);
        return () => {
            destroyUniver();
        };
    }, [data]);

    return <div ref={containerRef} className={style.univerContainer} />;
});

export const MemoSheet = memo(UniverSheet)