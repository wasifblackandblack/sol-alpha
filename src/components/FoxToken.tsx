import {
    IonButton,
    IonList,
    IonLabel, IonItem, IonCheckbox, IonInput, IonRow, IonCol
} from '@ionic/react';
import React, {KeyboardEvent, KeyboardEventHandler, useEffect, useMemo, useState} from 'react';
import {Table} from 'antd' // https://ant.design/components/table/
import { ColumnsType } from 'antd/es/table';
import Loader from "./Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";
import axios from "axios";

interface FoxToken {
    foo?: string;
    onSubmit(bar: string): unknown;
}

function FoxToken({ foo, onSubmit }: FoxToken) {

    /**
     * States & Variables
     */
    const [tableData, setTableData] = useState([])

    // TODO: filter dropdowns like fox token...
    // TODO: try and see if I can link these to our 'mints alerted table' or 'todays mints' table

    const columns: ColumnsType<any> = [
        { title: 'Token', key: 'token', dataIndex: 'token',
            // render: record => (
            //     <span>{record.createdAt.substring(0, 10)}</span>
            // ),
            sorter: (a, b) => a.token.localeCompare(b.token),
            // width: 130,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Floor Price', key: 'floorPrice', dataIndex: 'floorPrice', width: 150,
            sorter: (a, b) => a.floorPrice - b.floorPrice,},
        { title: 'Name', key: 'name', dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),},
        { title: 'Total Token Listings', key: 'totalTokenListings', dataIndex: 'totalTokenListings', width: 250,
            sorter: (a, b) => a.totalTokenListings - b.totalTokenListings,}

    ];


    /**
     * Use Effects
     */
    useEffect(() => {
        const fetchTableData = async () => {

            setTableData([]);

            instance
                .get(environment.backendApi + '/receiver/foxTokenAnalysis')
                .then((res) => {
                    setTableData(res.data.data);
                })
                .catch((err) => {
                    console.error("error when getting fox token data: " + err);
                });
        }
        fetchTableData();
    }, []);

    /**
     * Functions
     */

    /**
     * Renders
     */


    // TODO
    const url = 'https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q={%22$match%22:{%22collectionSymbol%22:%22cubistnft%22},%22$sort%22:{%22takerAmount%22:1,%22createdAt%22:-1},%22$skip%22:0,%22$limit%22:100}';
    const headers = {
        'origin': 'https://magiceden.io',
        // 'referer': 'https://magiceden.io/',
    }
    axios.get(url, { headers: headers }).then((data) => {
        console.log("data!");
        console.log(data);
    }).catch((err) => {
        console.error(err);
    });


    return (
        <>
            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                <div className={`font-bold pb-1 w-full`}><a href="https://famousfoxes.com/tokenmarket" className="underline" target="_blank">Fox Token Market - Analysis</a></div>
                {/*<p></p>*/}

                <div>
                {
                    !tableData.length
                        ?   <div className="pt-10 flex justify-center items-center">
                                <Loader />
                            </div>
                        : <div className=" ">

                            <IonRow>
                                <IonCol className='' size="8">
                                    <Table
                                        className='pt-2'
                                        key={'name'}
                                        dataSource={tableData}
                                        columns={columns}
                                        bordered
                                        // scroll={{x: 'max-content'}}
                                        scroll={{y: 400}}
                                        // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                                        // scroll={{x: 'max-content', y: 400}}
                                        pagination={false}
                                        style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                                    />
                                </IonCol>
                                <IonCol>
                                    {/*TODO: future charts i guess? */}
                                </IonCol>
                            </IonRow>

                            <br/><br/>

                        </div>
                }
                </div>
            </div>

        </>
    );
}
export default FoxToken;

