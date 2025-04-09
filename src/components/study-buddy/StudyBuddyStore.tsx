import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Sparkles, Heart, Zap, Coffee, Gift } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "food" | "toy" | "accessory" | "background";
  effect: {
    type: "energy" | "happiness" | "boost" | "appearance";
    value: number;
  };
}

interface StudyBuddyStoreProps {
  coins: number;
  onPurchase: (item: StoreItem, newCoins: number) => void;
}

export default function StudyBuddyStore({
  coins = 0,
  onPurchase,
}: StudyBuddyStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("food");

  const storeItems: StoreItem[] = [
    // Food items
    {
      id: "apple",
      name: "Energy Apple",
      description: "Restores 20% energy to your Study Buddy",
      price: 10,
      image: "🍎",
      category: "food",
      effect: { type: "energy", value: 20 },
    },
    {
      id: "cake",
      name: "Happy Cake",
      description: "Increases happiness by 15%",
      price: 15,
      image: "🍰",
      category: "food",
      effect: { type: "happiness", value: 15 },
    },
    {
      id: "coffee",
      name: "Study Coffee",
      description: "Boosts energy by 30% and happiness by 5%",
      price: 25,
      image: "☕",
      category: "food",
      effect: { type: "energy", value: 30 },
    },

    // Toys
    {
      id: "ball",
      name: "Bouncy Ball",
      description: "A fun toy that increases happiness by 20%",
      price: 30,
      image: "🏀",
      category: "toy",
      effect: { type: "happiness", value: 20 },
    },
    {
      id: "puzzle",
      name: "Brain Puzzle",
      description: "Increases happiness by 25% and gives 5% study boost",
      price: 40,
      image: "🧩",
      category: "toy",
      effect: { type: "happiness", value: 25 },
    },

    // Accessories
    {
      id: "glasses",
      name: "Smart Glasses",
      description: "Stylish accessory that gives 10% study boost",
      price: 50,
      image: "👓",
      category: "accessory",
      effect: { type: "boost", value: 10 },
    },
    {
      id: "hat",
      name: "Thinking Cap",
      description: "Increases study boost by 15%",
      price: 75,
      image: "🎓",
      category: "accessory",
      effect: { type: "boost", value: 15 },
    },

    // Backgrounds
    {
      id: "beach",
      name: "Beach Background",
      description: "A relaxing beach scene for your buddy",
      price: 100,
      image: "🏖️",
      category: "background",
      effect: { type: "appearance", value: 0 },
    },
    {
      id: "space",
      name: "Space Background",
      description: "An out-of-this-world backdrop",
      price: 150,
      image: "🌌",
      category: "background",
      effect: { type: "appearance", value: 0 },
    },
  ];

  const filteredItems = storeItems.filter(
    (item) => item.category === selectedCategory,
  );

  const handlePurchase = (item: StoreItem) => {
    if (coins >= item.price) {
      const newCoins = coins - item.price;
      onPurchase(item, newCoins);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5 text-[#0197cf]" />
          Study Buddy Store
        </CardTitle>
        <CardDescription>
          Spend your coins on items for your Study Buddy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">Available coins</div>
          <div className="bg-[#ffcc00]/20 rounded-lg px-3 py-1 font-bold flex items-center">
            <span className="mr-1">🪙</span> {coins}
          </div>
        </div>

        <Tabs
          defaultValue="food"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="food" className="text-xs">
              Food
            </TabsTrigger>
            <TabsTrigger value="toy" className="text-xs">
              Toys
            </TabsTrigger>
            <TabsTrigger value="accessory" className="text-xs">
              Accessories
            </TabsTrigger>
            <TabsTrigger value="background" className="text-xs">
              Backgrounds
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 flex flex-col"
                >
                  <div className="flex items-start mb-2">
                    <div className="text-3xl mr-3">{item.image}</div>
                    <div>
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-2">
                    <div className="flex items-center">
                      {item.effect.type === "energy" && (
                        <Zap className="h-3 w-3 text-blue-500 mr-1" />
                      )}
                      {item.effect.type === "happiness" && (
                        <Heart className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      {item.effect.type === "boost" && (
                        <Sparkles className="h-3 w-3 text-yellow-500 mr-1" />
                      )}
                      {item.effect.type === "appearance" && (
                        <Gift className="h-3 w-3 text-purple-500 mr-1" />
                      )}
                      <span className="text-xs font-medium">
                        {item.effect.type === "appearance"
                          ? "Cosmetic"
                          : `+${item.effect.value}%`}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant={coins >= item.price ? "default" : "outline"}
                      className={
                        coins >= item.price
                          ? "bg-[#0197cf] hover:bg-[#01729b]"
                          : ""
                      }
                      disabled={coins < item.price}
                      onClick={() => handlePurchase(item)}
                    >
                      <span className="mr-1">🪙</span> {item.price}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Earn coins by completing study sessions and maintaining your streak!
        </p>
      </CardFooter>
    </Card>
  );
}
