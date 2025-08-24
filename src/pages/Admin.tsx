import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Settings } from "lucide-react";

const Admin = () => {
  const [tracks, setTracks] = useState([
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      style: "Rock Clássico",
      source: "youtube",
      youtubeId: "fJ9rUzIMcZQ",
      year: 1975,
    },
    {
      id: "2", 
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      style: "Rock",
      source: "youtube",
      youtubeId: "1w7OgIMMRc4",
      year: 1987,
    }
  ]);

  const [gameSettings, setGameSettings] = useState({
    basePoints: 100,
    scoringMode: "FIXED",
    bonusMax: 50,
    questionTimeSec: 20,
    clipTimeSec: 15,
    maxPlayers: 8,
    totalQuestions: 10,
  });

  const styles = [
    "Rock", "Pop", "Sertanejo", "Rock Clássico", "MPB", "Funk", 
    "Hip Hop", "Reggae", "Blues", "Jazz", "Eletrônica", "Country"
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    import('@/lib/auth').then(({ logoutAdmin }) => {
      logoutAdmin();
      navigate('/admin/login');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">Gerencie o acervo musical e configurações do jogo</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracks">Acervo Musical</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Adicionar Nova Música
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" placeholder="Nome da música" />
                  </div>
                  <div>
                    <Label htmlFor="artist">Artista</Label>
                    <Input id="artist" placeholder="Nome do artista" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="style">Estilo Musical</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((style) => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Ano</Label>
                    <Input id="year" type="number" placeholder="2024" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube ID ou URL</Label>
                  <Input id="youtube" placeholder="fJ9rUzIMcZQ ou https://youtube.com/watch?v=..." />
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Música
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acervo Atual ({tracks.length} músicas)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{track.title}</h3>
                        <p className="text-sm text-muted-foreground">{track.artist} • {track.year}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{track.style}</Badge>
                          <Badge variant="outline">YouTube</Badge>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Jogo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Pontuação</h3>
                    <div>
                      <Label htmlFor="basePoints">Pontos Base</Label>
                      <Input 
                        id="basePoints" 
                        type="number" 
                        value={gameSettings.basePoints}
                        onChange={(e) => setGameSettings({...gameSettings, basePoints: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bonusMax">Bônus Máximo</Label>
                      <Input 
                        id="bonusMax" 
                        type="number" 
                        value={gameSettings.bonusMax}
                        onChange={(e) => setGameSettings({...gameSettings, bonusMax: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scoringMode">Modo de Pontuação</Label>
                      <Select 
                        value={gameSettings.scoringMode} 
                        onValueChange={(value) => setGameSettings({...gameSettings, scoringMode: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixo</SelectItem>
                          <SelectItem value="AUTO_GROW">Crescente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Tempo e Capacidade</h3>
                    <div>
                      <Label htmlFor="questionTime">Tempo por Pergunta (segundos)</Label>
                      <Input 
                        id="questionTime" 
                        type="number" 
                        value={gameSettings.questionTimeSec}
                        onChange={(e) => setGameSettings({...gameSettings, questionTimeSec: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clipTime">Duração do Clipe (segundos)</Label>
                      <Input 
                        id="clipTime" 
                        type="number" 
                        value={gameSettings.clipTimeSec}
                        onChange={(e) => setGameSettings({...gameSettings, clipTimeSec: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPlayers">Máximo de Jogadores</Label>
                      <Input 
                        id="maxPlayers" 
                        type="number" 
                        value={gameSettings.maxPlayers}
                        onChange={(e) => setGameSettings({...gameSettings, maxPlayers: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalQuestions">Total de Perguntas</Label>
                      <Input 
                        id="totalQuestions" 
                        type="number" 
                        value={gameSettings.totalQuestions}
                        onChange={(e) => setGameSettings({...gameSettings, totalQuestions: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Jogo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">142</div>
                    <div className="text-sm text-muted-foreground">Salas Criadas</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">1,247</div>
                    <div className="text-sm text-muted-foreground">Partidas Jogadas</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">3,891</div>
                    <div className="text-sm text-muted-foreground">Jogadores Únicos</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{tracks.length}</div>
                    <div className="text-sm text-muted-foreground">Músicas no Acervo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;