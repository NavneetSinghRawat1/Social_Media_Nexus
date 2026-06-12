import { useState,useEffect} from 'react';
import { Users, TrendingUp } from 'lucide-react';
import {fetchcommmtable} from '../api_temp/commApi';
export default function CommunityTable({setActiveFeed,
    setSelectedCommunity
  }) {


  const [communities, setCommunities] = useState([]);
  const [renderComm,setRenderComm]=useState([]);
  function formatNumber(num) {

      return new Intl.NumberFormat('en', {
          notation: 'compact',
          maximumFractionDigits: 1
      }).format(num);

  }
  const handleCommunityClick = (community) => {

      setSelectedCommunity(community);

      setActiveFeed("community_chat");
  };
  useEffect(() => {
    // Simulate fetching data from an API
    const loadContent = async () => {
            try {
                const data = await fetchcommmtable();
                // {console.log("data -> ",data);}
                setCommunities(data.table);
            } catch (err) {
                console.error("Error fetching data:", err.message);
            } finally {
                console.log("Finished loading community data table.");
            }
        };

        loadContent();


  },[]);
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
        <TrendingUp className="w-4 h-4 text-indigo-600" />
        <h2 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase">
          Top Communities
        </h2>
      </div>
      
      <div className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="pb-3 font-semibold">Community</th>
              <th className="pb-3 font-semibold text-right">Members</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {communities.map((community) => (
              <tr key={community.community_id} onClick={() => handleCommunityClick(community)} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 pr-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                      {/* {community.name.substring(2, 4)} */}
                      <img 
                        src={community.comm_pic} 
                        alt={community.name.substring(2, 4)} 
                        // className="w-10 h-10 rounded-full border border-slate-100 object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors block">
                        {community.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-right text-slate-500 font-medium">
                  <div className="flex items-center justify-end gap-1 text-xs">
                    <Users className="w-3.5 h-3.5 text-slate-300" />
                    <span>{formatNumber(community.total_members)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}